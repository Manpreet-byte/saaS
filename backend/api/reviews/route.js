import { NextResponse } from "next/server";

import { withJwtAuth } from "../../middleware/authMiddleware.js";
import {
  logEditedReviewResponse,
  logGeneratedReviewResponse,
} from "../../services/reviewService.js";

const parseReviewBody = async (request) => request.json();

const validateBody = (body) => body.reviewId && body.responseText;

const getIpAddress = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

export async function POST(request) {
  const { user, response } = await withJwtAuth(request, ["manager", "admin"]);

  if (response) {
    return response;
  }

  const body = await parseReviewBody(request);

  if (!validateBody(body)) {
    return NextResponse.json(
      { error: "reviewId and responseText are required" },
      { status: 400 },
    );
  }

  await logGeneratedReviewResponse({
    userId: user.sub,
    reviewId: body.reviewId,
    ipAddress: getIpAddress(request),
  });

  return NextResponse.json({
    success: true,
    message: "Review response action recorded",
    user,
  });
}

export async function PATCH(request) {
  const { user, response } = await withJwtAuth(request, ["manager", "admin"]);

  if (response) {
    return response;
  }

  const body = await parseReviewBody(request);

  if (!validateBody(body)) {
    return NextResponse.json(
      { error: "reviewId and responseText are required" },
      { status: 400 },
    );
  }

  await logEditedReviewResponse({
    userId: user.sub,
    reviewId: body.reviewId,
    ipAddress: getIpAddress(request),
  });

  return NextResponse.json({
    success: true,
    message: "Review response edit recorded",
    user,
  });
}
