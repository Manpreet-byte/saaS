import { NextRequest, NextResponse } from "next/server";

import { requireRole } from "@/lib/api/auth";
import { createAuditLog } from "@/lib/db/audit-logs";

type DashboardSettingsPayload = {
  updates?: Record<string, unknown>;
};

export async function PATCH(request: NextRequest) {
  const { session, response } = await requireRole(request, "admin");

  if (response) {
    return response;
  }

  const body = (await request.json()) as DashboardSettingsPayload;

  if (!body.updates || Object.keys(body.updates).length === 0) {
    return NextResponse.json(
      { error: "updates payload is required" },
      { status: 400 },
    );
  }

  await createAuditLog({
    userId: session.sub,
    action: "admin_settings_updated",
    resource: "admin_settings",
    ipAddress:
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
    metadata: body.updates,
  });

  return NextResponse.json({
    success: true,
    message: "Dashboard update recorded in audit log",
  });
}
