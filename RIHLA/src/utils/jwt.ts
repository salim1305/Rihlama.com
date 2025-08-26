import jwt from 'jsonwebtoken';
import { Response } from 'express';
import { IUser } from '../models/User';

interface TokenPayload {
  id: string;
  email: string;
  isHost: boolean;
}

export const generateTokens = (user: IUser) => {
  const payload: TokenPayload = {
    id: user._id,
    email: user.email,
    isHost: user.isHost
  };

  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

  const accessToken = jwt.sign(payload, jwtSecret, {
    expiresIn: '7d'
  });

  const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
    expiresIn: '30d'
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string): TokenPayload => {
  const jwtSecret = process.env.JWT_SECRET || 'default-secret';
  
  return jwt.verify(token, jwtSecret) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';
  
  return jwt.verify(token, jwtRefreshSecret) as TokenPayload;
};

export const sendTokenResponse = (user: IUser, statusCode: number, res: Response, message?: string) => {
  const { accessToken, refreshToken } = generateTokens(user);
  
  // Calculate expiry dates
  const accessTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Set HTTP-only cookies in production
  if (process.env.NODE_ENV === 'production') {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: accessTokenExpiry
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      expires: refreshTokenExpiry
    });
  }

  // Remove sensitive data from user object
  const userResponse = {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    phoneNumber: user.phoneNumber,
    isHost: user.isHost,
    superhost: user.superhost,
    joinDate: user.joinDate,
    reviewsCount: user.reviewsCount,
    rating: user.rating,
    responseRate: user.responseRate,
    languages: user.languages,
    experiencesCount: user.experiencesCount,
    isVerified: user.isVerified
  };

  res.status(statusCode).json({
    success: true,
    message: message || 'Success',
    data: {
      user: userResponse,
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
      }
    }
  });
};