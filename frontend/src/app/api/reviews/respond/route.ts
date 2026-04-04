import { NextRequest, NextResponse } from "next/server";

import { generateAutoResponse } from "@backend/services/autoResponseService.js";
import {
  getReviewById,
  updateReviewResponse as persistReviewResponse,
} from "@backend/services/reviewService.js";

import { withJwtAuth } from "@/lib/api/jwt-middleware";
import { createAuditLog } from "@/lib/db/audit-logs";

type ReviewResponseBody = {
  reviewId?: string;
  rating?: number;
  comment?: string;
  tone?: string;
  provider?: string;
  responseText?: string;
  status?: "draft" | "scheduled" | "posted";
  scheduledFor?: string;
};

export async function POST(request: NextRequest) {
  const { user, response } = await withJwtAuth(request, [
    "manager",
    "admin",
  ]);

  const allowLocalBypass =
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_UNAUTHENTICATED_REVIEW_RESPONSES !== "false";

  if (response && !allowLocalBypass) {
    return response;
  }

  const body = (await request.json()) as ReviewResponseBody;

  if (!body.reviewId) {
    return NextResponse.json(
      { error: "reviewId is required" },
      { status: 400 },
    );
  }

  const review = await getReviewById(body.reviewId);

  if (!review) {
    return NextResponse.json(
      { error: "Review not found" },
      { status: 404 },
    );
  }

  const rating = Number(body.rating ?? review.rating ?? 0);
  const comment = String(body.comment ?? review.comment ?? "").trim();
  const generated = body.responseText
    ? {
        provider: body.provider ?? "manual",
        sentiment: rating <= 2 ? "negative" : rating === 3 ? "neutral" : "positive",
        tone: body.tone ?? (rating <= 2 ? "apologetic" : rating === 3 ? "professional" : "friendly"),
        responseText: body.responseText,
      }
    : await generateAutoResponse({
        rating: Number.isFinite(rating) ? rating : 3,
        comment: comment || "Customer feedback",
        tone: body.tone,
        provider: body.provider,
      });

  const updatedReview = await persistReviewResponse({
    id: body.reviewId,
    responseText: generated.responseText,
    status: body.status ?? "draft",
    provider: generated.provider,
    sentiment: generated.sentiment,
    tone: generated.tone,
    scheduledFor: body.status === "scheduled" ? body.scheduledFor ?? null : null,
  });

  if (!updatedReview) {
    return NextResponse.json(
      { error: "Failed to persist generated response" },
      { status: 500 },
    );
  }

  if (user?.sub) {
    try {
      await createAuditLog({
        userId: user.sub,
        action: "review_response_generated",
        resource: "review_response",
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        metadata: {
          reviewId: body.reviewId,
          rating: Number.isFinite(rating) ? rating : null,
          provider: generated.provider,
          tone: generated.tone,
        },
      });
    } catch (error) {
      // Keep response generation available in local mode if audit storage is unavailable.
      console.warn("Audit log write skipped:", error instanceof Error ? error.message : error);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Review response action recorded",
    user,
    review: updatedReview,
    responseText: generated.responseText,
    provider: generated.provider,
    sentiment: generated.sentiment,
    tone: generated.tone,
  });
}

export async function PATCH(request: NextRequest) {
  const { user, response } = await withJwtAuth(request, [
    "manager",
    "admin",
  ]);

  const allowLocalBypass =
    process.env.NODE_ENV !== "production" &&
    process.env.ALLOW_UNAUTHENTICATED_REVIEW_RESPONSES !== "false";

  if (response && !allowLocalBypass) {
    return response;
  }

  const body = (await request.json()) as ReviewResponseBody;

  if (!body.reviewId || !body.responseText) {
    return NextResponse.json(
      { error: "reviewId and responseText are required" },
      { status: 400 },
    );
  }

  const updatedReview = await persistReviewResponse({
    id: body.reviewId,
    responseText: body.responseText,
    status: body.status ?? "posted",
    provider: body.provider,
    sentiment:
      body.rating !== undefined
        ? Number(body.rating) <= 2
          ? "negative"
          : Number(body.rating) === 3
            ? "neutral"
            : "positive"
        : undefined,
    tone: body.tone,
    scheduledFor: body.status === "scheduled" ? body.scheduledFor ?? null : null,
  });

  if (!updatedReview) {
    return NextResponse.json(
      { error: "Review not found" },
      { status: 404 },
    );
  }

  if (user?.sub) {
    try {
      await createAuditLog({
        userId: user.sub,
        action: "review_response_edited",
        resource: "review_response",
        ipAddress:
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
        metadata: {
          reviewId: body.reviewId,
        },
      });
    } catch (error) {
      console.warn("Audit log write skipped:", error instanceof Error ? error.message : error);
    }
  }

  return NextResponse.json({
    success: true,
    message: "Review response edit recorded",
    user,
    review: updatedReview,
  });
}
