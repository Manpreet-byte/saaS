import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/api/auth";
import { UserRole } from "@/lib/auth/types";
import { createAuditLog } from "@/lib/db/audit-logs";
import { updateUserRole } from "@/lib/db/users";

const validRoles: UserRole[] = ["admin", "manager", "user"];

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { session, response } = await requireRole(request, "admin");

  if (response) {
    return response;
  }

  const body = (await request.json()) as { role?: UserRole };

  if (!body.role || !validRoles.includes(body.role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { id } = await context.params;
  const updatedUser = await updateUserRole(id, body.role);

  if (!updatedUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await createAuditLog({
    userId: session.sub,
    action: "admin_settings_updated",
    resource: "user_role",
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    metadata: {
      targetUserId: id,
      updatedRole: body.role,
    },
  });

  return NextResponse.json({ user: updatedUser });
}
