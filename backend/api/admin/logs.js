import { NextResponse } from "next/server";

import { withJwtAuth } from "../../middleware/authMiddleware.js";
import { listAuditLogs } from "../../utils/logger.js";

export async function GET(request) {
  const { response } = await withJwtAuth(request, ["admin"]);

  if (response) {
    return response;
  }

  const logs = await listAuditLogs();
  return NextResponse.json({ logs });
}
