import { Request, Response } from 'express';
import { Booking, IBooking } from '../models/Booking';
import { Experience } from '../models/Experience';
import { User } from '../models/User';
import { catchAsync, createAppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

// Create new booking
export const createBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { experienceId, guests, checkIn, checkOut, message } = req.body;

  // Check if experience exists and is available
  const experience = await Experience.findOne({
    _id: experienceId,
    isActive: true,
    isApproved: true
  });

  if (!experience) {
    throw createAppError('Experience not found or not available', 404);
  }

  // Check if user is not the host
  if (experience.hostId.toString() === user._id) {
    throw createAppError('Cannot book your own experience', 400);
  }

  // Check if group size is within limits
  if (guests > experience.groupSize) {
    throw createAppError(`Maximum group size is ${experience.groupSize}`, 400);
  }

  // Calculate total price
  const totalPrice = experience.price * guests;

  // Check for conflicting bookings (if experience has capacity limits)
  const checkInDate = new Date(checkIn);
  const checkOutDate = checkOut ? new Date(checkOut) : checkInDate;

  const conflictingBookings = await Booking.find({
    experienceId,
    status: { $in: ['confirmed', 'pending'] },
    $or: [
      {
        checkIn: { $lte: checkOutDate },
        $or: [
          { checkOut: { $gte: checkInDate } },
          { checkOut: null, checkIn: { $gte: checkInDate, $lte: checkOutDate } }
        ]
      }
    ]
  });

  const totalBookedGuests = conflictingBookings.reduce((sum, booking) => sum + booking.guests, 0);
  
  if (totalBookedGuests + guests > experience.groupSize) {
    throw createAppError('Not enough capacity available for selected dates', 409);
  }

  // Create booking
  const booking = await Booking.create({
    experienceId,
    userId: user._id,
    guests,
    checkIn: checkInDate,
    checkOut: checkOutDate,
    totalPrice,
    message: message?.trim(),
    status: 'pending'
  });

  // Populate booking with experience and user data
  await booking.populate([
    {
      path: 'experienceId',
      select: 'title location images category duration hostId'
    },
    {
      path: 'userId',
      select: 'firstName lastName email avatar'
    }
  ]);

  res.status(201).json({
    success: true,
    message: 'Booking created successfully',
    data: {
      booking: {
        id: booking._id,
        experience: {
          id: (booking as any).experienceId._id,
          title: (booking as any).experienceId.title,
          location: (booking as any).experienceId.location,
          images: (booking as any).experienceId.images
        },
        guests: booking.guests,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        totalPrice: booking.totalPrice,
        status: booking.status,
        message: booking.message,
        bookingDate: booking.bookingDate
      }
    }
  });
});

// Get user's bookings
export const getUserBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const { page = 1, limit = 10, status } = req.query;

  const query: any = { userId: user._id };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const bookings = await Booking.find(query)
    .populate('experienceId', 'title location images category duration hostId')
    .populate('userId', 'firstName lastName email avatar')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments(query);

  const formattedBookings = bookings.map(booking => ({
    id: booking._id,
    experience: {
      id: (booking as any).experienceId._id,
      title: (booking as any).experienceId.title,
      location: (booking as any).experienceId.location,
      images: (booking as any).experienceId.images,
      category: (booking as any).experienceId.category,
      duration: (booking as any).experienceId.duration
    },
    guests: booking.guests,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: booking.totalPrice,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    message: booking.message,
    bookingDate: booking.bookingDate
  }));

  res.status(200).json({
    success: true,
    data: {
      bookings: formattedBookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get host's bookings
export const getHostBookings = catchAsync(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can view their bookings', 403);
  }

  const { page = 1, limit = 10, status } = req.query;

  // Get host's experiences first
  const hostExperiences = await Experience.find({ hostId: user._id }).select('_id');
  const experienceIds = hostExperiences.map(exp => exp._id);

  if (experienceIds.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        bookings: [],
        pagination: {
          currentPage: Number(page),
          totalPages: 0,
          totalResults: 0,
          limit: Number(limit)
        }
      }
    });
  }

  const query: any = { experienceId: { $in: experienceIds } };
  if (status) query.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const bookings = await Booking.find(query)
    .populate('experienceId', 'title location images category duration')
    .populate('userId', 'firstName lastName email avatar')
    .sort({ bookingDate: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments(query);

  const formattedBookings = bookings.map(booking => ({
    id: booking._id,
    experience: {
      id: (booking as any).experienceId._id,
      title: (booking as any).experienceId.title,
      location: (booking as any).experienceId.location,
      images: (booking as any).experienceId.images
    },
    guest: {
      id: (booking as any).userId._id,
      name: `${(booking as any).userId.firstName} ${(booking as any).userId.lastName}`,
      email: (booking as any).userId.email,
      avatar: (booking as any).userId.avatar
    },
    guests: booking.guests,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: booking.totalPrice,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    message: booking.message,
    bookingDate: booking.bookingDate
  }));

  res.status(200).json({
    success: true,
    data: {
      bookings: formattedBookings,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        totalResults: total,
        limit: Number(limit)
      }
    }
  });
});

// Get single booking
export const getBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const booking = await Booking.findById(id)
    .populate('experienceId', 'title location images category duration hostId')
    .populate('userId', 'firstName lastName email avatar phoneNumber');

  if (!booking) {
    throw createAppError('Booking not found', 404);
  }

  // Check if user is the booking owner or the host
  const isBookingOwner = booking.userId._id.toString() === user._id;
  const isExperienceHost = (booking as any).experienceId.hostId.toString() === user._id;

  if (!isBookingOwner && !isExperienceHost) {
    throw createAppError('Not authorized to view this booking', 403);
  }

  const formattedBooking = {
    id: booking._id,
    experience: {
      id: (booking as any).experienceId._id,
      title: (booking as any).experienceId.title,
      location: (booking as any).experienceId.location,
      images: (booking as any).experienceId.images,
      category: (booking as any).experienceId.category,
      duration: (booking as any).experienceId.duration
    },
    guest: {
      id: (booking as any).userId._id,
      name: `${(booking as any).userId.firstName} ${(booking as any).userId.lastName}`,
      email: (booking as any).userId.email,
      avatar: (booking as any).userId.avatar,
      phoneNumber: (booking as any).userId.phoneNumber
    },
    guests: booking.guests,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    totalPrice: booking.totalPrice,
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    message: booking.message,
    bookingDate: booking.bookingDate,
    cancellationReason: booking.cancellationReason,
    cancellationDate: booking.cancellationDate
  };

  res.status(200).json({
    success: true,
    data: { booking: formattedBooking }
  });
});

// Update booking status (host only)
export const updateBookingStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const user = req.user;

  if (!user || !user.isHost) {
    throw createAppError('Only hosts can update booking status', 403);
  }

  const booking = await Booking.findById(id).populate('experienceId', 'hostId');

  if (!booking) {
    throw createAppError('Booking not found', 404);
  }

  // Check if user is the host of this experience
  if ((booking as any).experienceId.hostId.toString() !== user._id) {
    throw createAppError('Not authorized to update this booking', 403);
  }

  // Valid status transitions
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw createAppError('Invalid status', 400);
  }

  const oldStatus = booking.status;
  booking.status = status;

  // If cancelling, add cancellation info
  if (status === 'cancelled' && oldStatus !== 'cancelled') {
    booking.cancellationDate = new Date();
    booking.cancellationReason = req.body.cancellationReason || 'Cancelled by host';
  }

  await booking.save();

  res.status(200).json({
    success: true,
    message: `Booking ${status} successfully`,
    data: {
      booking: {
        id: booking._id,
        status: booking.status,
        cancellationReason: booking.cancellationReason,
        cancellationDate: booking.cancellationDate
      }
    }
  });
});

// Cancel booking (guest only)
export const cancelBooking = catchAsync(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { cancellationReason } = req.body;
  const user = req.user;

  if (!user) {
    throw createAppError('Authentication required', 401);
  }

  const booking = await Booking.findOne({ _id: id, userId: user._id });

  if (!booking) {
    throw createAppError('Booking not found', 404);
  }

  // Check if booking can be cancelled
  if (booking.status === 'cancelled') {
    throw createAppError('Booking is already cancelled', 400);
  }

  if (booking.status === 'completed') {
    throw createAppError('Cannot cancel completed booking', 400);
  }

  // Check cancellation policy (24 hours before)
  const checkInTime = new Date(booking.checkIn).getTime();
  const now = Date.now();
  const hoursUntilCheckIn = (checkInTime - now) / (1000 * 60 * 60);

  if (hoursUntilCheckIn < 24) {
    throw createAppError('Cannot cancel within 24 hours of check-in', 400);
  }

  booking.status = 'cancelled';
  booking.cancellationDate = new Date();
  booking.cancellationReason = cancellationReason || 'Cancelled by guest';
  await booking.save();

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: {
      booking: {
        id: booking._id,
        status: booking.status,
        cancellationReason: booking.cancellationReason,
        cancellationDate: booking.cancellationDate
      }
    }
  });
});