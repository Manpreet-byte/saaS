import { NextRequest, NextResponse } from "next/server";

import { authEnv } from "@/lib/auth/env";
import { verifyJwt } from "@/lib/auth/jwt";
import { SessionPayload, UserRole } from "@/lib/auth/types";

export const getTokenFromRequest = (request: NextRequest) => {
  const authorizationHeader = request.headers.get("authorization");

  if (authorizationHeader?.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length).trim();
  }

  return request.cookies.get(authEnv.sessionCookieName)?.value ?? null;
};

export const authenticateUser = async (request: NextRequest) => {
  const token = getTokenFromRequest(request);

  if (!token) {
    return null;
  }

  return verifyJwt(token);
};

export const authorizeRole = (
  user: SessionPayload,
  allowedRoles?: UserRole[],
) => {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(user.role);
};

export const withJwtAuth = async (
  request: NextRequest,
  allowedRoles?: UserRole[],
): Promise<
  | { user: SessionPayload; response: null }
  | { user: null; response: NextResponse }
> => {
  const user = await authenticateUser(request);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Invalid or missing JWT token" },
        { status: 401 },
      ),
    };
  }

  if (!authorizeRole(user, allowedRoles)) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Insufficient role permissions" },
        { status: 403 },
      ),
    };
  }

  return { user, response: null };
};

export const attachUserToRequestHeaders = (
  request: NextRequest,
  user: SessionPayload,
) => {
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-user-id", user.sub);
  requestHeaders.set("x-user-email", user.email);
  requestHeaders.set("x-user-role", user.role);
  requestHeaders.set("x-user-business-name", user.businessName);
  requestHeaders.set("x-user-google-account-id", user.googleAccountId);

  return requestHeaders;
};

export const getAttachedUserFromHeaders = (headers: Headers) => {
  const id = headers.get("x-user-id");
  const email = headers.get("x-user-email");
  const role = headers.get("x-user-role") as UserRole | null;
  const businessName = headers.get("x-user-business-name");
  const googleAccountId = headers.get("x-user-google-account-id");

  if (!id || !email || !role || !businessName || !googleAccountId) {
    return null;
  }

  return {
    sub: id,
    email,
    role,
    businessName,
    googleAccountId,
  };
};
