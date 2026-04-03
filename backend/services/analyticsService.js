import { memoizeAsync } from "../utils/cache.js";
import {
  calculateAverageRating,
  groupReviewsByDate,
  listReviews,
} from "./reviewService.js";
import { countUsers } from "./userService.js";

const buildAnalytics = async () => {
  const [reviews, totalUsers] = await Promise.all([
    listReviews({ order: "asc" }),
    countUsers(),
  ]);

  const totalReviews = reviews.length;
  const averageRating = calculateAverageRating(reviews);
  const trends = groupReviewsByDate(reviews);
  const reviewers = totalReviews;
  const conversions = reviews.filter((review) => Number(review.rating) >= 4).length;

  const reviewerRate = totalUsers === 0 ? 0 : Number((reviewers / totalUsers).toFixed(2));
  const conversionRate = reviewers === 0 ? 0 : Number((conversions / reviewers).toFixed(2));

  return {
    averageRating,
    totalReviews,
    trends,
    funnel: {
      totalUsers,
      reviewers,
      conversions,
      stages: [
        {
          name: "Total Users",
          count: totalUsers,
          conversionRate: 1,
        },
        {
          name: "Reviewers",
          count: reviewers,
          conversionRate: reviewerRate,
        },
        {
          name: "Conversions",
          count: conversions,
          conversionRate,
        },
      ],
    },
  };
};

export const getAnalytics = memoizeAsync(buildAnalytics, 60_000);
