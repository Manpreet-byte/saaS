import { NextRequest, NextResponse } from "next/server";

import { createReview } from "@backend/services/reviewService.js";
import { generateAutoResponse } from "@backend/services/autoResponseService.js";

type FeedbackBody = {
  rating?: number;
  issue?: string;
  impact?: string;
  resolution?: string;
  notes?: string;
};

const buildPrivateComment = (body: Required<Pick<FeedbackBody, "issue" | "impact" | "resolution">> & { notes?: string }) => {
  const sections = [
    `Issue: ${body.issue}`,
    `Impact: ${body.impact}`,
    `Expected fix: ${body.resolution}`,
  ];

  if (body.notes?.trim()) {
    sections.push(`Notes: ${body.notes.trim()}`);
  }

  return sections.join("\n");
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as FeedbackBody;
    const rating = Number(body.rating ?? 0);
    const issue = String(body.issue ?? "").trim();
    const impact = String(body.impact ?? "").trim();
    const resolution = String(body.resolution ?? "").trim();
    const notes = String(body.notes ?? "").trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (!issue || !impact || !resolution) {
      return NextResponse.json(
        {
          success: false,
          error: "issue, impact, and resolution are required",
        },
        { status: 400 },
      );
    }

    const comment = buildPrivateComment({ issue, impact, resolution, notes });
    const review = await createReview({ rating, comment });
    const response = await generateAutoResponse({
      rating,
      comment,
      tone: rating <= 2 ? "apologetic" : rating === 3 ? "professional" : "friendly",
    });

    return NextResponse.json({
      success: true,
      review,
      responseText: response.responseText,
      provider: response.provider,
      sentiment: response.sentiment,
      tone: response.tone,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save feedback" },
      { status: 500 },
    );
  }
}