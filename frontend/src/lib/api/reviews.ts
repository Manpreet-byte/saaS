export type ReviewRecord = {
  id: string;
  rating: number;
  comment: string;
  response_text?: string;
  response_status?: ReviewResponseStatus;
  response_provider?: string | null;
  response_sentiment?: string | null;
  response_tone?: string | null;
  response_scheduled_for?: string | null;
  response_updated_at?: string | null;
  created_at: string;
};

export type ReviewResponseStatus = "draft" | "scheduled" | "posted";

export type ReviewFeedbackInput = {
  rating: number;
  comment: string;
};

export type InternalFeedbackInput = {
  rating: number;
  issue: string;
  impact: string;
  resolution: string;
  notes?: string;
};

export type ReviewResponseResult = {
  responseText: string;
  provider?: string;
  sentiment?: string;
  tone?: string;
  review?: ReviewRecord;
};

export type InternalFeedbackResult = ReviewResponseResult & {
  review: ReviewRecord;
};

type ApiListResponse = {
  success: boolean;
  reviews?: ReviewRecord[];
  error?: string;
};

type ApiCreateResponse = {
  success: boolean;
  review?: ReviewRecord;
  error?: string;
};

type ApiResponseResponse = {
  success: boolean;
  responseText?: string;
  provider?: string;
  sentiment?: string;
  tone?: string;
  review?: ReviewRecord;
  error?: string;
};

export const listReviews = async (): Promise<ReviewRecord[]> => {
  const response = await fetch("/api/reviews", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = (await response.json()) as ApiListResponse;

  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to load reviews");
  }

  return data.reviews ?? [];
};

export const submitReviewFeedback = async (
  input: ReviewFeedbackInput,
): Promise<ReviewRecord> => {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      rating: input.rating,
      comment: input.comment,
    }),
  });

  const data = (await response.json()) as ApiCreateResponse;

  if (!response.ok || !data.success || !data.review) {
    throw new Error(data.error || "Failed to save review feedback");
  }

  return data.review;
};

export const generateReviewResponse = async (input: {
  reviewId: string;
  rating: number;
  comment: string;
  tone?: string;
  provider?: string;
  responseText?: string;
}): Promise<ReviewResponseResult> => {
  const response = await fetch("/api/reviews/respond", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as ApiResponseResponse;

  if (!response.ok || !data.success || !data.responseText) {
    throw new Error(data.error || "Failed to generate response");
  }

  return {
    responseText: data.responseText,
    provider: data.provider,
    sentiment: data.sentiment,
    tone: data.tone,
    review: data.review,
  };
};

export const submitInternalFeedback = async (
  input: InternalFeedbackInput,
): Promise<InternalFeedbackResult> => {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    success: boolean;
    review?: ReviewRecord;
    responseText?: string;
    provider?: string;
    sentiment?: string;
    tone?: string;
    error?: string;
  };

  if (!response.ok || !data.success || !data.review || !data.responseText) {
    throw new Error(data.error || "Failed to save internal feedback");
  }

  return {
    review: data.review,
    responseText: data.responseText,
    provider: data.provider,
    sentiment: data.sentiment,
    tone: data.tone,
  };
};

export const updateReviewResponse = async (input: {
  reviewId: string;
  responseText: string;
  status?: ReviewResponseStatus;
  scheduledFor?: string | null;
  rating?: number;
  comment?: string;
  tone?: string;
  provider?: string;
}): Promise<ReviewRecord> => {
  const response = await fetch("/api/reviews/respond", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    success: boolean;
    review?: ReviewRecord;
    error?: string;
  };

  if (!response.ok || !data.success || !data.review) {
    throw new Error(data.error || "Failed to update response");
  }

  return data.review;
};