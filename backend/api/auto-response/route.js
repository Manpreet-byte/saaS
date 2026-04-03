import { NextResponse } from "next/server";

import { generateAutoResponse } from "../../services/autoResponseService.js";
import { isAutoResponseEnabled } from "../../services/settingsService.js";

export async function POST(request) {
  try {
    const enabled = await isAutoResponseEnabled();

    if (!enabled) {
      return NextResponse.json(
        { success: false, error: "Auto-response is disabled" },
        { status: 403 },
      );
    }

    const body = await request.json();
    const rating = Number(body.rating);
    const comment = String(body.comment ?? "").trim();
    const tone = body.tone;
    const provider = body.provider;

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

    const result = await generateAutoResponse({
      rating,
      comment,
      tone,
      provider,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate response" },
      { status: 500 },
    );
  }
}
