import { NextRequest, NextResponse } from "next/server";

import { withJwtAuth } from "@/lib/api/jwt-middleware";

export async function GET(request: NextRequest) {
  const { user, response } = await withJwtAuth(request, ["admin"]);

  if (response) {
    return response;
  }

  return NextResponse.json({
    message: "Admin route access granted",
    user,
  });
}
