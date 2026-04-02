export type UserRole = "admin" | "manager" | "user";

export type AppUser = {
  id: string;
  business_name: string;
  email: string;
  google_account_id: string;
  role: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type AuditAction =
  | "user_login"
  | "review_response_generated"
  | "review_response_edited"
  | "admin_settings_updated";

export type AuditLog = {
  id: string;
  user_id: string;
  action: AuditAction;
  resource: string;
  timestamp: string;
  ip_address: string | null;
  metadata?: Record<string, unknown> | null;
};

export type SessionPayload = {
  sub: string;
  email: string;
  role: UserRole;
  businessName: string;
  googleAccountId: string;
  iat: number;
  exp: number;
};

export type GoogleUserProfile = {
  sub: string;
  email: string;
  name?: string;
  verified_email?: boolean;
  picture?: string;
};
