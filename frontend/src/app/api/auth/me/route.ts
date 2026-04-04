import { NextRequest, NextResponse } from "next/server";

import { authenticateUser } from "@/lib/api/auth";
import { getUserById } from "@/lib/db/users";

export async function GET(request: NextRequest) {
  const { session, response } = await authenticateUser(request);

  if (response) {
    return response;
  }

  const user = await getUserById(session.sub);

  return NextResponse.json({
    user,
    session,
  });
}
