import { NextResponse } from "next/server";

import { getAnalytics } from "../../services/analyticsService.js";

export async function GET() {
  try {
    const analytics = await getAnalytics();

    return NextResponse.json({
      success: true,
      analytics,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
