const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'userId is required'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: [1, 'rating must be at least 1'],
      max: [5, 'rating must be at most 5']
    },
    reviewText: {
      type: String,
      required: [true, 'reviewText is required'],
      trim: true,
      maxlength: [5000, 'reviewText is too long']
    },
    autoResponse: {
      type: String,
      default: null
    },
    toneUsed: {
      type: String,
      enum: ['friendly', 'professional', 'sarcastic', null],
      default: null
    },
    respondedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
