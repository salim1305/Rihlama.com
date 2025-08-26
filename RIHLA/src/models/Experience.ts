import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  hostId: mongoose.Types.ObjectId;
  category: string;
  duration: string;
  groupSize: number;
  highlights: string[];
  rating: number;
  reviewCount: number;
  isActive: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const experienceSchema = new Schema<IExperience>({
  title: {
    type: String,
    required: [true, 'Experience title is required'],
    trim: true,
    maxLength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxLength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    enum: [
      'Marrakech',
      'Casablanca', 
      'Fes',
      'Chefchaouen',
      'Essaouira',
      'Merzouga',
      'Ouarzazate',
      'Tangier',
      'Rabat',
      'Agadir'
    ]
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    type: String,
    required: true
  }],
  hostId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Host ID is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['adventure', 'accommodation', 'tour', 'experience', 'food', 'culture']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true
  },
  groupSize: {
    type: Number,
    required: [true, 'Group size is required'],
    min: [1, 'Group size must be at least 1'],
    max: [50, 'Group size cannot exceed 50']
  },
  highlights: [{
    type: String,
    trim: true,
    maxLength: [100, 'Each highlight cannot exceed 100 characters']
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { 
    virtuals: true,
    transform: function(doc, ret) {
      return ret;
    }
  }
});

// Virtual to populate host information
experienceSchema.virtual('host', {
  ref: 'User',
  localField: 'hostId',
  foreignField: '_id',
  justOne: true
});

// Indexes for better query performance
experienceSchema.index({ hostId: 1 });
experienceSchema.index({ category: 1 });
experienceSchema.index({ location: 1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ price: 1 });
experienceSchema.index({ isActive: 1, isApproved: 1 });
experienceSchema.index({ createdAt: -1 });

// Text index for search functionality
experienceSchema.index({
  title: 'text',
  description: 'text',
  location: 'text',
  highlights: 'text'
});

export const Experience = mongoose.model<IExperience>('Experience', experienceSchema);