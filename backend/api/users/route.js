import { NextResponse } from "next/server";

import { requireRole } from "../../middleware/roleMiddleware.js";
import { listUsers } from "../../services/userService.js";

export async function GET(request) {
  const { response } = await requireRole(request, "admin");

  if (response) {
    return response;
  }

  const users = await listUsers();
  return NextResponse.json({ users });
}
