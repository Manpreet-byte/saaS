const Review = require('../models/Review');
const Setting = require('../models/Setting');
const AppError = require('../utils/appError');
const asyncHandler = require('../middleware/asyncHandler');
const { generateAutoResponse } = require('../services/responseService');

const createReview = asyncHandler(async (req, res) => {
  const { userId, rating, reviewText } = req.body;
  const parsedRating = Number(rating);

  if (!userId || rating === undefined || reviewText === undefined) {
    throw new AppError('userId, rating, and reviewText are required', 400);
  }

  if (Number.isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    throw new AppError('rating must be a number between 1 and 5', 400);
  }

  const review = await Review.create({
    userId: String(userId).trim(),
    rating: parsedRating,
    reviewText: String(reviewText).trim()
  });

  const settings = await Setting.getSingleton();

  if (settings.autoResponseEnabled) {
    review.autoResponse = generateAutoResponse({
      rating: review.rating,
      reviewText: review.reviewText,
      tone: settings.tone
    });
    review.toneUsed = settings.tone;
    review.respondedAt = new Date();
    await review.save();
  }

  res.status(201).json({
    success: true,
    message: 'Review created successfully',
    data: review
  });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: reviews.length,
    data: reviews
  });
});

module.exports = {
  createReview,
  getAllReviews
};
