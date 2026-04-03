import { NextResponse } from "next/server";

import { getSettings, updateSettings } from "../../services/settingsService.js";

export async function GET() {
  try {
    const settings = await getSettings();

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const updates = {};

    if (typeof body.autoResponseEnabled === "boolean") {
      updates.auto_response_enabled = body.autoResponseEnabled;
    }

    if (typeof body.tone === "string") {
      updates.tone = body.tone;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, error: "autoResponseEnabled or tone is required" },
        { status: 400 },
      );
    }

    if (
      updates.tone &&
      !["friendly", "professional", "apologetic"].includes(updates.tone)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "tone must be friendly, professional, or apologetic",
        },
        { status: 400 },
      );
    }

    const settings = await updateSettings(updates);

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update settings" },
      { status: 500 },
    );
  }
}
