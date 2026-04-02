import { NextRequest, NextResponse } from "next/server";

import { SessionPayload, UserRole } from "@/lib/auth/types";
import {
  authenticateUser as authenticateJwtUser,
  authorizeRole as authorizeJwtRole,
} from "@/lib/api/jwt-middleware";

export const unauthorizedJson = (message = "Unauthorized") =>
  NextResponse.json({ error: message }, { status: 401 });

export const forbiddenJson = (message = "Forbidden") =>
  NextResponse.json({ error: message }, { status: 403 });

type AuthSuccess = { session: SessionPayload; response: null };
type AuthFailure = { session: null; response: NextResponse };

export const authenticateUser = async (
  request: NextRequest,
): Promise<AuthSuccess | AuthFailure> => {
  const session = await authenticateJwtUser(request);

  if (!session) {
    return { session: null, response: unauthorizedJson() };
  }

  return { session, response: null };
};

export const authorizeRole = (
  session: SessionPayload,
  roles: UserRole | UserRole[],
): NextResponse | null => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  if (!authorizeJwtRole(session, allowedRoles)) {
    return forbiddenJson();
  }

  return null;
};

export const requireRole = async (
  request: NextRequest,
  roles?: UserRole | UserRole[],
): Promise<
  | { session: SessionPayload; response: null }
  | { session: null; response: NextResponse }
> => {
  const authentication = await authenticateUser(request);

  if (authentication.response) {
    return authentication;
  }

  if (roles) {
    const authorizationError = authorizeRole(authentication.session, roles);

    if (authorizationError) {
      return { session: null, response: authorizationError };
    }
  }

  return authentication;
};
