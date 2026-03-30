const asyncHandler = require('../middleware/asyncHandler');
const {
  getAverageRating,
  getReviewsOverTime,
  getFunnelMetrics
} = require('../services/analyticsService');

const averageRating = asyncHandler(async (req, res) => {
  const data = await getAverageRating();

  res.status(200).json({
    success: true,
    data
  });
});

const reviewsOverTime = asyncHandler(async (req, res) => {
  const data = await getReviewsOverTime();

  res.status(200).json({
    success: true,
    data
  });
});

const funnel = asyncHandler(async (req, res) => {
  const data = await getFunnelMetrics();

  res.status(200).json({
    success: true,
    data
  });
});

module.exports = {
  averageRating,
  reviewsOverTime,
  funnel
};
