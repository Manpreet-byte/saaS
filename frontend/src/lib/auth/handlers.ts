import { NextRequest, NextResponse } from "next/server";

import { authEnv } from "@/lib/auth/env";
import {
  exchangeCodeForTokens,
  fetchGoogleUserProfile,
} from "@/lib/auth/google";
import {
  clearSessionCookie,
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { createAuditLog } from "@/lib/db/audit-logs";
import { upsertGoogleUser } from "@/lib/db/users";

const secureCookie = process.env.NODE_ENV === "production";

export const handleGoogleLogin = async () => {
  const state = crypto.randomUUID();
  const response = NextResponse.redirect(
    new URL(
      `/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: authEnv.googleClientId,
        redirect_uri: authEnv.googleRedirectUri,
        response_type: "code",
        scope: authEnv.googleScopes,
        access_type: "offline",
        include_granted_scopes: "true",
        prompt: "consent",
        state,
      }).toString()}`,
      "https://accounts.google.com",
    ),
  );

  response.cookies.set(authEnv.oauthStateCookieName, state, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
};

export const handleGoogleCallback = async (request: NextRequest) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get(authEnv.oauthStateCookieName)?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json(
      { error: "Invalid or expired Google OAuth state" },
      { status: 400 },
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);
    const googleProfile = await fetchGoogleUserProfile(tokens.access_token);
    const user = await upsertGoogleUser(googleProfile);
    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      businessName: user.business_name,
      googleAccountId: user.google_account_id,
    });
    const response = NextResponse.json({
      token,
      user: {
        id: user.id,
        business_name: user.business_name,
        email: user.email,
        google_account_id: user.google_account_id,
        created_at: user.created_at ?? null,
      },
    });

    response.cookies.set(authEnv.oauthStateCookieName, "", {
      httpOnly: true,
      secure: secureCookie,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    setSessionCookie(response, token);
    await createAuditLog({
      userId: user.id,
      action: "user_login",
      resource: "auth",
      ipAddress:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null,
      metadata: {
        email: user.email,
        googleAccountId: user.google_account_id,
      },
    });

    return response;
  } catch (error) {
    const response = NextResponse.json(
      {
        error: "Google authentication failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );

    clearSessionCookie(response);
    return response;
  }
};
