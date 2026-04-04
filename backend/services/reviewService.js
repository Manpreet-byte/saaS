import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { supabaseCount, supabaseRequest } from "../db/supabaseClient.js";

const reviewsTable = "reviews";

const serviceDir = path.dirname(fileURLToPath(import.meta.url));
const localDataDir = path.resolve(serviceDir, "..", ".data");
const localReviewsFile = path.join(localDataDir, "reviews.json");

let localReviews = [];
let localStoreLoaded = false;
let localStoreLoadPromise = null;

const RESPONSE_STATUS_DRAFT = "draft";

const isPlaceholderValue = (value = "") => {
  const normalized = String(value).trim().toLowerCase();
  return (
    !normalized ||
    normalized.includes("your-project") ||
    normalized.includes("your-service-role-key")
  );
};

const isSupabaseConfigured = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  return !isPlaceholderValue(url) && !isPlaceholderValue(key);
};

const readLocalReviewsFile = async () => {
  try {
    const fileContents = await readFile(localReviewsFile, "utf8");
    const parsed = JSON.parse(fileContents);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((review) => review && typeof review === "object");
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }

    console.warn("Failed to read local review store:", error.message);
    return [];
  }
};

const ensureLocalStore = async () => {
  if (localStoreLoaded) {
    return localReviews;
  }

  if (!localStoreLoadPromise) {
    localStoreLoadPromise = (async () => {
      const reviews = await readLocalReviewsFile();
      localReviews = reviews;
      localStoreLoaded = true;
      return localReviews;
    })();
  }

  return localStoreLoadPromise;
};

const persistLocalStore = async () => {
  await mkdir(localDataDir, { recursive: true });
  await writeFile(localReviewsFile, JSON.stringify(localReviews, null, 2), "utf8");
};

const createLocalReview = ({
  rating,
  comment,
  responseText = "",
  responseStatus = RESPONSE_STATUS_DRAFT,
  responseProvider = null,
  responseSentiment = null,
  responseTone = null,
  responseScheduledFor = null,
}) => ({
  id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  rating,
  comment,
  response_text: responseText,
  response_status: responseStatus,
  response_provider: responseProvider,
  response_sentiment: responseSentiment,
  response_tone: responseTone,
  response_scheduled_for: responseScheduledFor,
  response_updated_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
});

const listLocalReviews = ({ order = "desc" } = {}) => {
  const cloned = [...localReviews];
  cloned.sort((a, b) => {
    const left = new Date(a.created_at).getTime();
    const right = new Date(b.created_at).getTime();
    return order === "asc" ? left - right : right - left;
  });
  return cloned;
};

const findLocalReviewById = (id) =>
  localReviews.find((review) => review.id === id) ?? null;

const updateLocalReviewResponse = ({
  id,
  responseText,
  status,
  provider,
  sentiment,
  tone,
  scheduledFor,
}) => {
  const index = localReviews.findIndex((review) => review.id === id);

  if (index === -1) {
    return null;
  }

  const current = localReviews[index];
  const next = {
    ...current,
    response_text: responseText,
    response_status: status ?? current.response_status ?? RESPONSE_STATUS_DRAFT,
    response_provider: provider ?? current.response_provider ?? null,
    response_sentiment: sentiment ?? current.response_sentiment ?? null,
    response_tone: tone ?? current.response_tone ?? null,
    response_scheduled_for: scheduledFor ?? current.response_scheduled_for ?? null,
    response_updated_at: new Date().toISOString(),
  };

  localReviews[index] = next;
  return next;
};

export const listReviews = async ({ order = "desc" } = {}) =>
  {
    if (!isSupabaseConfigured()) {
      await ensureLocalStore();
      return listLocalReviews({ order });
    }

    try {
      return await supabaseRequest(reviewsTable, {
        query: {
          select:
            "id,rating,comment,response_text,response_status,response_provider,response_sentiment,response_tone,response_scheduled_for,response_updated_at,created_at",
          order: `created_at.${order}`,
        },
      });
    } catch (error) {
      console.warn("Falling back to local review store:", error.message);
      return listLocalReviews({ order });
    }
  };

export const getReviewById = async (id) => {
  if (!isSupabaseConfigured()) {
    await ensureLocalStore();
    return findLocalReviewById(id);
  }

  try {
    const rows = await supabaseRequest(reviewsTable, {
      query: {
        select:
          "id,rating,comment,response_text,response_status,response_provider,response_sentiment,response_tone,response_scheduled_for,response_updated_at,created_at",
        id: `eq.${id}`,
        limit: "1",
      },
    });

    return rows?.[0] ?? null;
  } catch (error) {
    console.warn("Falling back to local review store:", error.message);
    return findLocalReviewById(id);
  }
};

export const createReview = async ({
  rating,
  comment,
  responseText = "",
  responseStatus = RESPONSE_STATUS_DRAFT,
  responseProvider = null,
  responseSentiment = null,
  responseTone = null,
  responseScheduledFor = null,
}) => {
  if (!isSupabaseConfigured()) {
    await ensureLocalStore();
    const review = createLocalReview({
      rating,
      comment,
      responseText,
      responseStatus,
      responseProvider,
      responseSentiment,
      responseTone,
      responseScheduledFor,
    });
    localReviews.push(review);
    await persistLocalStore();
    return review;
  }

  try {
    const rows = await supabaseRequest(reviewsTable, {
      method: "POST",
      body: {
        rating,
        comment,
        response_text: responseText,
        response_status: responseStatus,
        response_provider: responseProvider,
        response_sentiment: responseSentiment,
        response_tone: responseTone,
        response_scheduled_for: responseScheduledFor,
      },
    });

    return rows?.[0] ?? null;
  } catch (error) {
    console.warn("Falling back to local review store:", error.message);
    await ensureLocalStore();
    const review = createLocalReview({
      rating,
      comment,
      responseText,
      responseStatus,
      responseProvider,
      responseSentiment,
      responseTone,
      responseScheduledFor,
    });
    localReviews.push(review);
    await persistLocalStore();
    return review;
  }
};

export const updateReviewResponse = async ({
  id,
  responseText,
  status,
  provider,
  sentiment,
  tone,
  scheduledFor,
}) => {
  if (!isSupabaseConfigured()) {
    await ensureLocalStore();
    const updatedReview = updateLocalReviewResponse({
      id,
      responseText,
      status,
      provider,
      sentiment,
      tone,
      scheduledFor,
    });

    if (updatedReview) {
      await persistLocalStore();
    }

    return updatedReview;
  }

  try {
    const rows = await supabaseRequest(reviewsTable, {
      method: "PATCH",
      query: {
        id: `eq.${id}`,
      },
      body: {
        response_text: responseText,
        response_status: status,
        response_provider: provider,
        response_sentiment: sentiment,
        response_tone: tone,
        response_scheduled_for: scheduledFor,
        response_updated_at: new Date().toISOString(),
      },
    });

    return rows?.[0] ?? null;
  } catch (error) {
    console.warn("Falling back to local review store:", error.message);
    await ensureLocalStore();
    const updatedReview = updateLocalReviewResponse({
      id,
      responseText,
      status,
      provider,
      sentiment,
      tone,
      scheduledFor,
    });

    if (updatedReview) {
      await persistLocalStore();
    }

    return updatedReview;
  }
};

export const countReviews = async () => {
  if (!isSupabaseConfigured()) {
    await ensureLocalStore();
    return localReviews.length;
  }

  try {
    return await supabaseCount(reviewsTable);
  } catch (error) {
    console.warn("Falling back to local review store:", error.message);
    return localReviews.length;
  }
};

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
