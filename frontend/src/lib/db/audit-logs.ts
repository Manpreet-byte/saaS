import { headers } from "next/headers";

import { AuditAction, AuditLog } from "@/lib/auth/types";
import { supabaseRequest } from "@/lib/db/supabase-admin";

const auditLogsTable = "audit_logs";

export const getRequestIpAddress = async () => {
  const headerStore = await headers();

  return (
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerStore.get("x-real-ip") ??
    null
  );
};

export const createAuditLog = async (params: {
  userId: string;
  action: AuditAction;
  resource: string;
  ipAddress?: string | null;
  metadata?: Record<string, unknown>;
}) => {
  const logs = await supabaseRequest<AuditLog[]>(auditLogsTable, {
    method: "POST",
    body: {
      user_id: params.userId,
      action: params.action,
      resource: params.resource,
      ip_address: params.ipAddress ?? (await getRequestIpAddress()),
      metadata: params.metadata ?? null,
    },
  });

  return logs[0];
};

export const listAuditLogs = async () =>
  supabaseRequest<AuditLog[]>(auditLogsTable, {
    query: {
      select: "id,user_id,action,resource,timestamp,ip_address,metadata",
      order: "timestamp.desc",
    },
  });
