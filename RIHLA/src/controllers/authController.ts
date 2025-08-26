import { Request, Response } from 'express';
import { User, IUser } from '../models/User';
import { catchAsync, createAppError } from '../middleware/errorHandler';
import { sendTokenResponse, verifyRefreshToken } from '../utils/jwt';
import { AuthRequest } from '../middleware/auth';

// Register new user
export const register = catchAsync(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phoneNumber, dateOfBirth, isHost } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw createAppError('Email already registered', 400);
  }

  // Create new user
  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    password,
    phoneNumber,
    dateOfBirth,
    isHost: isHost || false
  });

  sendTokenResponse(user, 201, res, 'Account created successfully');
});

// Login user
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user and include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user || !(await user.comparePassword(password))) {
    throw createAppError('Invalid email or password', 401);
  }

  // Update last active
  user.lastActive = new Date();
  await user.save();

  sendTokenResponse(user, 200, res, 'Login successful');
});

// Logout user (optional - mainly for clearing cookies)
export const logout = catchAsync(async (req: Request, res: Response) => {
  // Clear cookies if they exist
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Get current user profile
export const getMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (!user) {
    throw createAppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        isHost: user.isHost,
        superhost: user.superhost,
        joinDate: user.joinDate,
        reviewsCount: user.reviewsCount,
        rating: user.rating,
        responseRate: user.responseRate,
        languages: user.languages,
        experiencesCount: user.experiencesCount,
        isVerified: user.isVerified,
        lastActive: user.lastActive
      }
    }
  });
});

// Update current user profile
export const updateMe = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;
  
  if (!user) {
    throw createAppError('User not found', 404);
  }

  // Fields that can be updated
  const allowedFields = [
    'firstName', 'lastName', 'phoneNumber', 'dateOfBirth', 
    'avatar', 'languages', 'responseRate'
  ];

  const updates: Partial<IUser> = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      (updates as any)[field] = req.body[field];
    }
  });

  // Update user
  Object.assign(user, updates);
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        isHost: user.isHost,
        superhost: user.superhost,
        joinDate: user.joinDate,
        reviewsCount: user.reviewsCount,
        rating: user.rating,
        responseRate: user.responseRate,
        languages: user.languages,
        experiencesCount: user.experiencesCount,
        isVerified: user.isVerified
      }
    }
  });
});

// Change password
export const changePassword = catchAsync(async (req: AuthRequest, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user;

  if (!user) {
    throw createAppError('User not found', 404);
  }

  // Get user with password
  const userWithPassword = await User.findById(user._id).select('+password');
  
  if (!userWithPassword || !(await userWithPassword.comparePassword(currentPassword))) {
    throw createAppError('Current password is incorrect', 400);
  }

  userWithPassword.password = newPassword;
  await userWithPassword.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Refresh access token
export const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw createAppError('Refresh token is required', 400);
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw createAppError('User not found', 404);
    }

    sendTokenResponse(user, 200, res, 'Token refreshed successfully');
  } catch (error) {
    throw createAppError('Invalid refresh token', 401);
  }
});

// Become a host
export const becomeHost = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('User not found', 404);
  }

  if (user.isHost) {
    throw createAppError('User is already a host', 400);
  }

  user.isHost = true;
  user.responseRate = 0;
  user.languages = user.languages || ['Arabic', 'French'];
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Successfully became a host',
    data: {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: user.name,
        email: user.email,
        isHost: user.isHost,
        responseRate: user.responseRate,
        languages: user.languages
      }
    }
  });
});

// Forgot password (placeholder - would integrate with email service)
export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email: email.toLowerCase() });
  
  if (!user) {
    // Don't reveal if email exists for security
    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset link has been sent'
    });
    return;
  }

  // Here you would generate reset token and send email
  // For now, just return success message
  res.status(200).json({
    success: true,
    message: 'If the email exists, a password reset link has been sent'
  });
});

// Verify email (placeholder)
export const verifyEmail = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('User not found', 404);
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});