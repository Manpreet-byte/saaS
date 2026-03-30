import { NextRequest, NextResponse } from "next/server";

import { withJwtAuth } from "@/lib/api/jwt-middleware";
import { createAuditLog } from "@/lib/db/audit-logs";

type ReviewResponseBody = {
  reviewId?: string;
  responseText?: string;
};

export async function POST(request: NextRequest) {
  const { user, response } = await withJwtAuth(request, [
    "manager",
    "admin",
  ]);

  if (response) {
    return response;
  }

  const body = (await request.json()) as ReviewResponseBody;

  if (!body.reviewId || !body.responseText) {
    return NextResponse.json(
      { error: "reviewId and responseText are required" },
      { status: 400 },
    );
  }

  await createAuditLog({
    userId: user.sub,
    action: "review_response_generated",
    resource: "review_response",
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    metadata: {
      reviewId: body.reviewId,
    },
  });

  return NextResponse.json({
    success: true,
    message: "Review response action recorded",
    user,
  });
}

export async function PATCH(request: NextRequest) {
  const { user, response } = await withJwtAuth(request, [
    "manager",
    "admin",
  ]);

  if (response) {
    return response;
  }

  const body = (await request.json()) as ReviewResponseBody;

  if (!body.reviewId || !body.responseText) {
    return NextResponse.json(
      { error: "reviewId and responseText are required" },
      { status: 400 },
    );
  }

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

  return NextResponse.json({
    success: true,
    message: "Review response edit recorded",
    user,
  });
}
