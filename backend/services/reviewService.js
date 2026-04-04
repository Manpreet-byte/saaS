import { supabaseCount, supabaseRequest } from "../db/supabaseClient.js";

const reviewsTable = "reviews";

export const listReviews = async ({ order = "desc" } = {}) =>
  supabaseRequest(reviewsTable, {
    query: {
      select: "id,rating,comment,created_at",
      order: `created_at.${order}`,
    },
  });

export const getReviewById = async (id) => {
  const rows = await supabaseRequest(reviewsTable, {
    query: {
      select: "id,rating,comment,created_at",
      id: `eq.${id}`,
      limit: "1",
    },
  });

  return rows?.[0] ?? null;
};

export const createReview = async ({ rating, comment }) => {
  const rows = await supabaseRequest(reviewsTable, {
    method: "POST",
    body: {
      rating,
      comment,
    },
  });

  return rows?.[0] ?? null;
};

export const countReviews = async () => supabaseCount(reviewsTable);

export const calculateAverageRating = (reviews) => {
  if (!reviews.length) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return Number((total / reviews.length).toFixed(2));
};

export const groupReviewsByDate = (reviews) => {
  const grouped = new Map();

  for (const review of reviews) {
    const dateKey = String(review.created_at).slice(0, 10);
    const current = grouped.get(dateKey) ?? { count: 0, totalRating: 0 };

    grouped.set(dateKey, {
      count: current.count + 1,
      totalRating: current.totalRating + Number(review.rating || 0),
    });
  }

  return Array.from(grouped.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, stats]) => ({
      date,
      reviews: stats.count,
      averageRating: Number((stats.totalRating / stats.count).toFixed(2)),
    }));
};
