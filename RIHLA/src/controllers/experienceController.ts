import { Request, Response } from 'express';
import { Experience, IExperience } from '../models/Experience';
import { User } from '../models/User';
import { catchAsync, createAppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Get all experiences with filtering, sorting, and pagination
export const getExperiences = catchAsync(async (req: Request, res: Response) => {
  const {
    page = 1,
    limit = 12,
    category,
    location,
    minPrice,
    maxPrice,
    minRating,
    search,
    sortBy = 'createdAt',
    order = 'desc'
  } = req.query;

  // Build query
  const query: any = { isActive: true, isApproved: true };

  if (category) query.category = category;
  if (location) query.location = location;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }
  if (minRating) query.rating = { $gte: Number(minRating) };

  // Text search
  if (search) {
    query.$text = { $search: search as string };
  }

  // Calculate skip
  const skip = (Number(page) - 1) * Number(limit);

  // Build sort object
  const sort: any = {};
  sort[sortBy as string] = order === 'desc' ? -1 : 1;

  // Execute query with population
  const experiences = await Experience.find(query)
    .populate('hostId', 'firstName lastName avatar superhost rating reviewsCount')
    .sort(sort)
    .skip(skip)
    .limit(Number(limit));

  // Get total count for pagination
  const total = await Experience.countDocuments(query);

  // Format response
  const formattedExperiences = experiences.map(exp => ({
    id: exp._id,
    title: exp.title,
    description: exp.description,
    location: exp.location,
    price: exp.price,
    images: exp.images,
    category: exp.category,
    duration: exp.duration,
    groupSize: exp.groupSize,
    highlights: exp.highlights,
    rating: exp.rating,
    reviewCount: exp.reviewCount,
    host: {
      id: (exp as any).hostId._id,
      name: `${(exp as any).hostId.firstName} ${(exp as any).hostId.lastName}`,
      avatar: (exp as any).hostId.avatar,
      superhost: (exp as any).hostId.superhost
    },
    createdAt: exp.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      experiences: formattedExperiences,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit),
        hasNext: skip + Number(limit) < total,
        hasPrev: Number(page) > 1
      }
    }
  });
});

// Get single experience by ID
export const getExperience = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const experience = await Experience.findOne({ 
    _id: id, 
    isActive: true, 
    isApproved: true 
  })
    .populate('hostId', 'firstName lastName avatar superhost rating reviewsCount responseRate languages joinDate');

  if (!experience) {
    throw createAppError('Experience not found', 404);
  }

  const formattedExperience = {
    id: experience._id,
    title: experience.title,
    description: experience.description,
    location: experience.location,
    price: experience.price,
    images: experience.images,
    category: experience.category,
    duration: experience.duration,
    groupSize: experience.groupSize,
    highlights: experience.highlights,
    rating: experience.rating,
    reviewCount: experience.reviewCount,
    host: {
      id: (experience as any).hostId._id,
      name: `${(experience as any).hostId.firstName} ${(experience as any).hostId.lastName}`,
      avatar: (experience as any).hostId.avatar,
      superhost: (experience as any).hostId.superhost,
      rating: (experience as any).hostId.rating,
      reviewsCount: (experience as any).hostId.reviewsCount,
      responseRate: (experience as any).hostId.responseRate,
      languages: (experience as any).hostId.languages,
      joinDate: (experience as any).hostId.joinDate
    },
    createdAt: experience.createdAt,
    updatedAt: experience.updatedAt
  };

  res.status(200).json({
    success: true,
    data: {
      experience: formattedExperience
    }
  });
});

// Create new experience (host only)
export const createExperience = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can create experiences', 403);
  }

  const {
    title,
    description,
    location,
    price,
    images,
    category,
    duration,
    groupSize,
    highlights
  } = req.body;

  const experience = await Experience.create({
    title,
    description,
    location,
    price,
    images,
    hostId: user._id,
    category,
    duration,
    groupSize,
    highlights,
    isApproved: false // Requires admin approval
  });

  // Update user's experience count
  await User.findByIdAndUpdate(user._id, {
    $inc: { experiencesCount: 1 }
  });

  res.status(201).json({
    success: true,
    message: 'Experience created successfully and is pending approval',
    data: {
      experience: {
        id: experience._id,
        title: experience.title,
        description: experience.description,
        location: experience.location,
        price: experience.price,
        category: experience.category,
        isApproved: experience.isApproved
      }
    }
  });
});

// Update experience (host only)
export const updateExperience = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can update experiences', 403);
  }

  const experience = await Experience.findOne({ _id: id, hostId: user._id });

  if (!experience) {
    throw createAppError('Experience not found or not owned by you', 404);
  }

  // Fields that can be updated
  const allowedFields = [
    'title', 'description', 'location', 'price', 'images',
    'category', 'duration', 'groupSize', 'highlights'
  ];

  const updates: Partial<IExperience> = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      (updates as any)[field] = req.body[field];
    }
  });

  // If significant changes, require re-approval
  const significantFields = ['title', 'description', 'price', 'category'];
  const hasSignificantChanges = significantFields.some(field => req.body[field] !== undefined);
  
  if (hasSignificantChanges) {
    updates.isApproved = false;
  }

  Object.assign(experience, updates);
  await experience.save();

  res.status(200).json({
    success: true,
    message: hasSignificantChanges 
      ? 'Experience updated successfully and is pending re-approval'
      : 'Experience updated successfully',
    data: {
      experience: {
        id: experience._id,
        title: experience.title,
        description: experience.description,
        isApproved: experience.isApproved
      }
    }
  });
});

// Delete/Deactivate experience (host only)
export const deleteExperience = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can delete experiences', 403);
  }

  const experience = await Experience.findOne({ _id: id, hostId: user._id });

  if (!experience) {
    throw createAppError('Experience not found or not owned by you', 404);
  }

  // Soft delete by deactivating
  experience.isActive = false;
  await experience.save();

  // Update user's experience count
  await User.findByIdAndUpdate(user._id, {
    $inc: { experiencesCount: -1 }
  });

  res.status(200).json({
    success: true,
    message: 'Experience deleted successfully'
  });
});

// Get host's experiences
export const getHostExperiences = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can view their experiences', 403);
  }

  const { page = 1, limit = 10, status } = req.query;

  const query: any = { hostId: user._id };
  
  if (status === 'active') query.isActive = true;
  if (status === 'inactive') query.isActive = false;
  if (status === 'approved') query.isApproved = true;
  if (status === 'pending') query.isApproved = false;

  const skip = (Number(page) - 1) * Number(limit);

  const experiences = await Experience.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Experience.countDocuments(query);

  const formattedExperiences = experiences.map(exp => ({
    id: exp._id,
    title: exp.title,
    description: exp.description,
    location: exp.location,
    price: exp.price,
    images: exp.images,
    category: exp.category,
    rating: exp.rating,
    reviewCount: exp.reviewCount,
    isActive: exp.isActive,
    isApproved: exp.isApproved,
    createdAt: exp.createdAt
  }));

  res.status(200).json({
    success: true,
    data: {
      experiences: formattedExperiences,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get experience categories
export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = [
    { id: 'adventure', name: 'Adventure', icon: '🏔️' },
    { id: 'accommodation', name: 'Stay', icon: '🏠' },
    { id: 'tour', name: 'Tours', icon: '🚶' },
    { id: 'experience', name: 'Experiences', icon: '🎭' },
    { id: 'food', name: 'Food & Drink', icon: '🍽️' },
    { id: 'culture', name: 'Culture', icon: '🕌' }
  ];

  res.status(200).json({
    success: true,
    data: { categories }
  });
});

// Get Moroccan cities
export const getCities = catchAsync(async (req: Request, res: Response) => {
  const cities = [
    'Marrakech', 'Casablanca', 'Fes', 'Chefchaouen', 'Essaouira',
    'Merzouga', 'Ouarzazate', 'Tangier', 'Rabat', 'Agadir'
  ];

  res.status(200).json({
    success: true,
    data: { cities }
  });
});