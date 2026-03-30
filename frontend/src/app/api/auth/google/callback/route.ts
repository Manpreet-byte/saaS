import { NextRequest } from "next/server";

import { handleGoogleCallback } from "@/lib/auth/handlers";

export async function GET(request: NextRequest) {
  return handleGoogleCallback(request);
}
