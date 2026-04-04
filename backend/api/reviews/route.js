import { NextResponse } from "next/server";

import { createReview, listReviews } from "../../services/reviewService.js";

export async function GET() {
  try {
    const reviews = await listReviews({ order: "desc" });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim();

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    if (!comment) {
      return NextResponse.json(
        { success: false, error: "comment is required" },
        { status: 400 },
      );
    }

    const review = await createReview({ rating, comment });

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create review" },
      { status: 500 },
    );
  }
}
