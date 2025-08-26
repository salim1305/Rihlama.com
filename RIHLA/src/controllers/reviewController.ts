import { Request, Response } from 'express';
import { Review, IReview } from '../models/Review';
import { Booking } from '../models/Booking';
import { Experience } from '../models/Experience';
import { User } from '../models/User';
import { catchAsync, createAppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get reviews for an experience
export const getExperienceReviews = catchAsync(async (req: Request, res: Response) => {
  const { experienceId } = req.params;
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

  // Check if experience exists
  const experience = await Experience.findById(experienceId);
  if (!experience) {
    throw createAppError('Experience not found', 404);
  }

  const skip = (Number(page) - 1) * Number(limit);

  // Build sort object
  const sort: any = {};
  sort[sortBy as string] = order === 'desc' ? -1 : 1;

  const reviews = await Review.find({
    experienceId,
    isApproved: true
  })
    .populate('userId', 'firstName lastName avatar')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({
    experienceId,
    isApproved: true
  });

  // Calculate rating distribution
  const ratingDistribution = await Review.aggregate([
    { $match: { experienceId: experience._id, isApproved: true } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } }
  ]);

  const formattedReviews = reviews.map(review => ({
    id: review._id,
    user: {
      id: (review as any).userId._id,
      name: `${(review as any).userId.firstName} ${(review as any).userId.lastName}`,
      avatar: (review as any).userId.avatar
    },
    rating: review.rating,
    comment: review.comment,
    helpful: review.helpful,
    createdAt: review.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      reviews: formattedReviews,
      ratingDistribution,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      },
      experience: {
        id: experience._id,
        title: experience.title,
        averageRating: experience.rating,
        totalReviews: experience.reviewCount
      }
    }
  });
});

// Create a new review
export const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { experienceId, bookingId, rating, comment } = req.body;

  // Check if booking exists and belongs to user
  const booking = await Booking.findOne({
    _id: bookingId,
    userId: user._id,
    experienceId,
    status: 'completed'
  });

  if (!booking) {
    throw createAppError('Valid completed booking required to leave a review', 400);
  }

  // Check if user already reviewed this experience
  const existingReview = await Review.findOne({
    userId: user._id,
    experienceId
  });

  if (existingReview) {
    throw createAppError('You have already reviewed this experience', 400);
  }

  // Create review
  const review = await Review.create({
    userId: user._id,
    experienceId,
    bookingId,
    rating,
    comment: comment.trim()
  });

  // Populate user data for response
  await review.populate('userId', 'firstName lastName avatar');

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: {
      review: {
        id: review._id,
        user: {
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          avatar: user.avatar
        },
        rating: review.rating,
        comment: review.comment,
        helpful: review.helpful,
        createdAt: review.createdAt
      }
    }
  });
});

// Update a review
export const updateReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const review = await Review.findOne({
    _id: id,
    userId: user._id
  });

  if (!review) {
    throw createAppError('Review not found or not owned by you', 404);
  }

  // Check if review is within edit window (e.g., 24 hours)
  const reviewAge = Date.now() - review.createdAt.getTime();
  const editWindow = 24 * 60 * 60 * 1000; // 24 hours

  if (reviewAge > editWindow) {
    throw createAppError('Review can only be edited within 24 hours', 400);
  }

  // Update review
  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment.trim();

  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review updated successfully',
    data: {
      review: {
        id: review._id,
        rating: review.rating,
        comment: review.comment,
        updatedAt: review.updatedAt
      }
    }
  });
});

// Delete a review
export const deleteReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const review = await Review.findOne({
    _id: id,
    userId: user._id
  });

  if (!review) {
    throw createAppError('Review not found or not owned by you', 404);
  }

  await Review.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Review deleted successfully'
  });
});

// Mark review as helpful
export const markHelpful = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const review = await Review.findById(id);

  if (!review) {
    throw createAppError('Review not found', 404);
  }

  // Prevent users from marking their own reviews as helpful
  if (review.userId.toString() === user._id) {
    throw createAppError('Cannot mark your own review as helpful', 400);
  }

  // Increment helpful count
  review.helpful += 1;
  await review.save();

  res.status(200).json({
    success: true,
    message: 'Review marked as helpful',
    data: {
      review: {
        id: review._id,
        helpful: review.helpful
      }
    }
  });
});

// Report a review
export const reportReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const review = await Review.findById(id);

  if (!review) {
    throw createAppError('Review not found', 404);
  }

  // Prevent users from reporting their own reviews
  if (review.userId.toString() === user._id) {
    throw createAppError('Cannot report your own review', 400);
  }

  // Increment report count
  review.reportCount += 1;

  // If too many reports, mark as not approved
  if (review.reportCount >= 5) {
    review.isApproved = false;
  }

  await review.save();

  // Here you would typically log the report with reason
  console.log(`Review ${id} reported by user ${user._id} for reason: ${reason}`);

  res.status(200).json({
    success: true,
    message: 'Review reported successfully'
  });
});

// Get user's reviews
export const getUserReviews = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({
    userId: user._id,
    isApproved: true
  })
    .populate('experienceId', 'title location images category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({
    userId: user._id,
    isApproved: true
  });

  const formattedReviews = reviews.map(review => ({
    id: review._id,
    experience: {
      id: (review as any).experienceId._id,
      title: (review as any).experienceId.title,
      location: (review as any).experienceId.location,
      images: (review as any).experienceId.images,
      category: (review as any).experienceId.category
    },
    rating: review.rating,
    comment: review.comment,
    helpful: review.helpful,
    createdAt: review.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      reviews: formattedReviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get reviews received by host
export const getHostReviews = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can view received reviews', 403);
  }

  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  // Get host's experiences
  const hostExperiences = await Experience.find({ hostId: user._id }).select('_id');
  const experienceIds = hostExperiences.map(exp => exp._id);

  if (experienceIds.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        reviews: [],
        pagination: {
          currentPage: Number(page),
          totalPages: 0,
          totalResults: 0,
          limit: Number(limit)
        }
      }
    });
  }

  const reviews = await Review.find({
    experienceId: { $in: experienceIds },
    isApproved: true
  })
    .populate('userId', 'firstName lastName avatar')
    .populate('experienceId', 'title location images')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({
    experienceId: { $in: experienceIds },
    isApproved: true
  });

  const formattedReviews = reviews.map(review => ({
    id: review._id,
    user: {
      id: (review as any).userId._id,
      name: `${(review as any).userId.firstName} ${(review as any).userId.lastName}`,
      avatar: (review as any).userId.avatar
    },
    experience: {
      id: (review as any).experienceId._id,
      title: (review as any).experienceId.title,
      location: (review as any).experienceId.location,
      images: (review as any).experienceId.images
    },
    rating: review.rating,
    comment: review.comment,
    helpful: review.helpful,
    createdAt: review.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      reviews: formattedReviews,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});