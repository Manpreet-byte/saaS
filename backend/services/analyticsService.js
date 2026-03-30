const Review = require('../models/Review');
const Setting = require('../models/Setting');
const AppError = require('../utils/appError');

const buildDailySeries = async () => {
  const results = await Review.aggregate([
    {
      $group: {
        _id: {
          day: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt',
              timezone: 'UTC'
            }
          }
        },
        reviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { '_id.day': 1 } }
  ]);

  return results.map((item) => ({
    period: item._id.day,
    reviews: item.reviews,
    averageRating: Number(item.averageRating.toFixed(2))
  }));
};

const buildWeeklySeries = async () => {
  const results = await Review.aggregate([
    {
      $group: {
        _id: {
          year: { $isoWeekYear: '$createdAt' },
          week: { $isoWeek: '$createdAt' }
        },
        reviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } }
  ]);

  return results.map((item) => ({
    period: `${item._id.year}-W${String(item._id.week).padStart(2, '0')}`,
    reviews: item.reviews,
    averageRating: Number(item.averageRating.toFixed(2))
  }));
};

const buildMonthlySeries = async () => {
  const results = await Review.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        reviews: { $sum: 1 },
        averageRating: { $avg: '$rating' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  return results.map((item) => ({
    period: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
    reviews: item.reviews,
    averageRating: Number(item.averageRating.toFixed(2))
  }));
};

const getAverageRating = async () => {
  const [result] = await Review.aggregate([
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return {
    averageRating: result ? Number(result.averageRating.toFixed(2)) : 0,
    totalReviews: result ? result.totalReviews : 0
  };
};

const getReviewsOverTime = async () => {
  const [daily, weekly, monthly] = await Promise.all([
    buildDailySeries(),
    buildWeeklySeries(),
    buildMonthlySeries()
  ]);

  return {
    daily,
    weekly,
    monthly
  };
};

const getFunnelMetrics = async () => {
  const [setting, reviewedUsers, totalReviews] = await Promise.all([
    Setting.getSingleton(),
    Review.distinct('userId'),
    Review.countDocuments()
  ]);

  const reviewedUsersCount = reviewedUsers.length;
  const totalUsers = setting.totalUsers > 0 ? setting.totalUsers : reviewedUsersCount;
  const conversionRate = totalUsers > 0 ? Number(((reviewedUsersCount / totalUsers) * 100).toFixed(2)) : 0;

  return {
    totalUsers,
    reviewedUsers: reviewedUsersCount,
    totalReviews,
    conversionRate
  };
};

module.exports = {
  getAverageRating,
  getReviewsOverTime,
  getFunnelMetrics
};
