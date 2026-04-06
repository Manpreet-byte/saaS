import { createAuditLog } from "../utils/logger.js";

export const logGeneratedReviewResponse = async ({ userId, reviewId, ipAddress }) =>
  createAuditLog({
    userId,
    action: "review_response_generated",
    resource: "review_response",
    ipAddress,
    metadata: { reviewId },
  });

export const logEditedReviewResponse = async ({ userId, reviewId, ipAddress }) =>
  createAuditLog({
    userId,
    action: "review_response_edited",
    resource: "review_response",
    ipAddress,
    metadata: { reviewId },
  });
