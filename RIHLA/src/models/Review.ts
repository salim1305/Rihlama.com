import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  experienceId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  helpful: number;
  reportCount: number;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  experienceId: {
    type: Schema.Types.ObjectId,
    ref: 'Experience',
    required: [true, 'Experience ID is required']
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minLength: [10, 'Comment must be at least 10 characters'],
    maxLength: [1000, 'Comment cannot exceed 1000 characters']
  },
  helpful: {
    type: Number,
    default: 0,
    min: 0
  },
  reportCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

// Virtual to populate user information
reviewSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate experience information
reviewSchema.virtual('experience', {
  ref: 'Experience',
  localField: 'experienceId',
  foreignField: '_id',
  justOne: true
});

// Virtual to populate booking information
reviewSchema.virtual('booking', {
  ref: 'Booking',
  localField: 'bookingId',
  foreignField: '_id',
  justOne: true
});

// Indexes for better query performance
reviewSchema.index({ experienceId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ bookingId: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ isApproved: 1 });

// Compound indexes
reviewSchema.index({ experienceId: 1, rating: -1 });
reviewSchema.index({ experienceId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, experienceId: 1 }, { unique: true }); // One review per user per experience

// Pre-save middleware to update experience rating
reviewSchema.post('save', async function() {
  try {
    const Experience = mongoose.model('Experience');
    
    // Calculate average rating for the experience
    const stats = await mongoose.model('Review').aggregate([
      { $match: { experienceId: this.experienceId, isApproved: true } },
      {
        $group: {
          _id: '$experienceId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Experience.findByIdAndUpdate(this.experienceId, {
        rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
        reviewCount: stats[0].reviewCount
      });
    }
  } catch (error) {
    console.error('Error updating experience rating:', error);
  }
});

// Pre-remove middleware to update experience rating when review is deleted
reviewSchema.post('findOneAndDelete', async function(doc) {
  if (doc) {
    try {
      const Experience = mongoose.model('Experience');
      
      const stats = await mongoose.model('Review').aggregate([
        { $match: { experienceId: doc.experienceId, isApproved: true } },
        {
          $group: {
            _id: '$experienceId',
            averageRating: { $avg: '$rating' },
            reviewCount: { $sum: 1 }
          }
        }
      ]);

      const updateData = stats.length > 0 
        ? {
            rating: Math.round(stats[0].averageRating * 10) / 10,
            reviewCount: stats[0].reviewCount
          }
        : {
            rating: 0,
            reviewCount: 0
          };

      await Experience.findByIdAndUpdate(doc.experienceId, updateData);
    } catch (error) {
      console.error('Error updating experience rating after review deletion:', error);
    }
  }
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);