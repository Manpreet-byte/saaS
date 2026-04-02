import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { authEnv } from "@/lib/auth/env";
import { signJwt, verifyJwt } from "@/lib/auth/jwt";
import { SessionPayload, UserRole } from "@/lib/auth/types";

const secureCookie = process.env.NODE_ENV === "production";

export const createSessionToken = async (payload: {
  sub: string;
  email: string;
  role: UserRole;
  businessName: string;
  googleAccountId: string;
}) => signJwt(payload);

export const setSessionCookie = (
  response: NextResponse,
  token: string,
  expiresInSeconds = authEnv.jwtExpiresInSeconds,
) => {
  response.cookies.set(authEnv.sessionCookieName, token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: expiresInSeconds,
  });

  return response;
};

export const clearSessionCookie = (response: NextResponse) => {
  response.cookies.set(authEnv.sessionCookieName, "", {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
};

export const getSessionFromRequest = async (request: NextRequest) => {
  const token = request.cookies.get(authEnv.sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyJwt(token);
};

export const getSessionFromCookies = async (): Promise<SessionPayload | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(authEnv.sessionCookieName)?.value;

  if (!token) {
    return null;
  }

  return verifyJwt(token);
};
