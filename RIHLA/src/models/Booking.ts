import mongoose, { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  _id: string;
  experienceId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  guests: number;
  checkIn: Date;
  checkOut?: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';
  totalPrice: number;
  bookingDate: Date;
  message?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  cancellationReason?: string;
  cancellationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  experienceId: {
    type: Schema.Types.ObjectId,
    ref: 'Experience',
    required: [true, 'Experience ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest is required'],
    max: [50, 'Cannot exceed 50 guests']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOut: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price cannot be negative']
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  message: {
    type: String,
    trim: true,
    maxLength: [500, 'Message cannot exceed 500 characters']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: {
    type: String,
    default: null
  },
  cancellationReason: {
    type: String,
    trim: true,
    maxLength: [500, 'Cancellation reason cannot exceed 500 characters']
  },
  cancellationDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual to populate experience information
bookingSchema.virtual('experience', {
  ref: 'Experience',
  localField: 'experienceId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate user information
bookingSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Indexes for better query performance
bookingSchema.index({ experienceId: 1 });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ paymentStatus: 1 });
bookingSchema.index({ bookingDate: -1 });
bookingSchema.index({ checkIn: 1 });

// Compound indexes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ experienceId: 1, status: 1 });
bookingSchema.index({ experienceId: 1, checkIn: 1 });

// Pre-save validation
bookingSchema.pre<IBooking>('save', function(next) {
  // Validate check-out date if provided
  if (this.checkOut && this.checkOut < this.checkIn) {
    return next(new Error('Check-out date must be after check-in date'));
  }

  // Validate booking date is not in the past
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (this.checkIn < today) {
    return next(new Error('Check-in date cannot be in the past'));
  }

  next();
});

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);