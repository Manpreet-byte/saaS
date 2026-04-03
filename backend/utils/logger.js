import { supabaseRequest } from "../db/supabaseClient.js";

const auditLogsTable = "audit_logs";

export const createAuditLog = async ({
  userId,
  action,
  resource,
  ipAddress = null,
  metadata = null,
}) => {
  const rows = await supabaseRequest(auditLogsTable, {
    method: "POST",
    body: {
      user_id: userId,
      action,
      resource,
      ip_address: ipAddress,
      metadata,
    },
  });

  return rows?.[0] ?? null;
};

export const listAuditLogs = async () =>
  supabaseRequest(auditLogsTable, {
    query: {
      select: "id,user_id,action,resource,timestamp,ip_address,metadata",
      order: "timestamp.desc",
    },
  });

export const getRequestIpAddress = (request) =>
  request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
  request.headers.get("x-real-ip") ??
  null;
