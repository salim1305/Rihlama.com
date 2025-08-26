import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { Experience } from '../models/Experience';
import { Booking } from '../models/Booking';
import { Review } from '../models/Review';
import { catchAsync, createAppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get user profile by ID (public)
export const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    throw createAppError('User ID is required', 400);
  }

  const user = await User.findById(id).select('-password -resetPasswordToken -resetPasswordExpires');

  if (!user) {
    throw createAppError('User not found', 404);
  }

  // Get user's public statistics
  const stats = await getUserStats(id);

  const userProfile = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    avatar: user.avatar,
    isHost: user.isHost,
    superhost: user.superhost,
    joinDate: user.joinDate,
    reviewsCount: user.reviewsCount,
    rating: user.rating,
    responseRate: user.responseRate,
    languages: user.languages,
    experiencesCount: user.experiencesCount,
    isVerified: user.isVerified,
    stats
  };

  res.status(200).json({
    success: true,
    data: {
      user: userProfile
    }
  });
});

// Get user statistics
const getUserStats = async (userId: string) => {
  const [
    totalBookings,
    completedBookings,
    totalReviews,
    hostExperiences,
    hostBookings
  ] = await Promise.all([
    Booking.countDocuments({ userId, status: { $in: ['confirmed', 'completed'] } }),
    Booking.countDocuments({ userId, status: 'completed' }),
    Review.countDocuments({ userId, isApproved: true }),
    Experience.countDocuments({ hostId: userId, isActive: true }),
    Booking.countDocuments({ 
      experienceId: { $in: await Experience.find({ hostId: userId }).select('_id') },
      status: { $in: ['confirmed', 'completed'] }
    })
  ]);

  return {
    totalBookings,
    completedBookings,
    totalReviews,
    hostExperiences,
    hostBookings
  };
};

// Search users
export const searchUsers = catchAsync(async (req: Request, res: Response) => {
  const { 
    q, 
    userType, 
    page = 1, 
    limit = 10,
    minRating,
    location 
  } = req.query;

  const query: any = {};

  // Text search
  if (q) {
    query.$or = [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }

  // Filter by user type
  if (userType === 'host') {
    query.isHost = true;
  } else if (userType === 'guest') {
    query.isHost = false;
  }

  // Filter by minimum rating
  if (minRating) {
    query.rating = { $gte: Number(minRating) };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const users = await User.find(query)
    .select('-password -resetPasswordToken -resetPasswordExpires -email')
    .sort({ rating: -1, reviewsCount: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  const formattedUsers = users.map(user => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    avatar: user.avatar,
    isHost: user.isHost,
    superhost: user.superhost,
    rating: user.rating,
    reviewsCount: user.reviewsCount,
    responseRate: user.responseRate,
    languages: user.languages,
    experiencesCount: user.experiencesCount,
    joinDate: user.joinDate
  }));

  res.status(200).json({
    success: true,
    data: {
      users: formattedUsers,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get user's favorite experiences
export const getFavorites = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  // Note: This is a simplified version. In a real app, you'd have a favorites collection
  // For now, we'll return experiences the user has reviewed positively
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const favoriteReviews = await Review.find({
    userId: user._id,
    rating: { $gte: 4 },
    isApproved: true
  })
    .populate({
      path: 'experienceId',
      populate: {
        path: 'hostId',
        select: 'firstName lastName avatar superhost'
      }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({
    userId: user._id,
    rating: { $gte: 4 },
    isApproved: true
  });

  const favorites = favoriteReviews.map(review => ({
    id: (review as any).experienceId._id,
    title: (review as any).experienceId.title,
    location: (review as any).experienceId.location,
    price: (review as any).experienceId.price,
    images: (review as any).experienceId.images,
    category: (review as any).experienceId.category,
    rating: (review as any).experienceId.rating,
    reviewCount: (review as any).experienceId.reviewCount,
    host: {
      id: (review as any).experienceId.hostId._id,
      name: `${(review as any).experienceId.hostId.firstName} ${(review as any).experienceId.hostId.lastName}`,
      avatar: (review as any).experienceId.hostId.avatar,
      superhost: (review as any).experienceId.hostId.superhost
    },
    favoriteDate: review.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      favorites,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get user dashboard stats
export const getDashboardStats = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const userId = user._id;

  // Get comprehensive stats
  const [
    userBookings,
    userReviews,
    unreadMessages,
    hostStats
  ] = await Promise.all([
    // User's bookings
    Booking.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' }
        }
      }
    ]),
    
    // User's reviews given
    Review.countDocuments({ userId, isApproved: true }),
    
    // Unread messages count (simplified)
    0, // Would implement with Message model
    
    // Host statistics (if user is a host)
    user.isHost ? Promise.all([
      Experience.countDocuments({ hostId: userId, isActive: true }),
      Experience.countDocuments({ hostId: userId, isActive: true, isApproved: true }),
      Booking.aggregate([
        {
          $lookup: {
            from: 'experiences',
            localField: 'experienceId',
            foreignField: '_id',
            as: 'experience'
          }
        },
        { $unwind: '$experience' },
        { $match: { 'experience.hostId': userId } },
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            totalEarnings: { $sum: '$totalPrice' }
          }
        }
      ]),
      Review.aggregate([
        {
          $lookup: {
            from: 'experiences',
            localField: 'experienceId',
            foreignField: '_id',
            as: 'experience'
          }
        },
        { $unwind: '$experience' },
        { $match: { 'experience.hostId': userId, isApproved: true } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 }
          }
        }
      ])
    ]) : [0, 0, [], []]
  ]);

  const dashboardData = {
    user: {
      id: user._id,
      name: user.name,
      avatar: user.avatar,
      isHost: user.isHost,
      superhost: user.superhost,
      memberSince: user.joinDate
    },
    bookings: {
      total: userBookings.reduce((sum, booking) => sum + booking.count, 0),
      byStatus: userBookings,
      totalSpent: userBookings.reduce((sum, booking) => sum + (booking.totalSpent || 0), 0)
    },
    reviews: {
      given: userReviews
    },
    messages: {
      unread: unreadMessages
    }
  };

  // Add host stats if user is a host
  if (user.isHost) {
    const [totalExperiences, approvedExperiences, hostBookings, hostReviews] = hostStats as any[];
    
    (dashboardData as any).host = {
      experiences: {
        total: totalExperiences,
        approved: approvedExperiences,
        pending: totalExperiences - approvedExperiences
      },
      bookings: {
        byStatus: hostBookings,
        total: hostBookings.reduce((sum: number, booking: any) => sum + booking.count, 0),
        totalEarnings: hostBookings.reduce((sum: number, booking: any) => sum + (booking.totalEarnings || 0), 0)
      },
      reviews: {
        received: hostReviews[0]?.totalReviews || 0,
        averageRating: hostReviews[0]?.averageRating || 0
      }
    };
  }

  res.status(200).json({
    success: true,
    data: dashboardData
  });
});

// Update user preferences
export const updatePreferences = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const allowedPreferences = [
    'emailNotifications',
    'smsNotifications',
    'marketingEmails',
    'bookingReminders',
    'reviewReminders',
    'currency',
    'language',
    'timezone'
  ];

  const updates: any = {};
  allowedPreferences.forEach(pref => {
    if (req.body[pref] !== undefined) {
      updates[pref] = req.body[pref];
    }
  });

  if (Object.keys(updates).length === 0) {
    throw createAppError('No valid preferences provided', 400);
  }

  // In a real app, you'd have a UserPreferences model
  // For now, we'll just return success
  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: updates
  });
});