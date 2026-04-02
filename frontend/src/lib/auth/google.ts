import { authEnv } from "@/lib/auth/env";
import { GoogleUserProfile } from "@/lib/auth/types";

const googleAuthBaseUrl = "https://accounts.google.com/o/oauth2/v2/auth";
const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleUserInfoUrl = "https://openidconnect.googleapis.com/v1/userinfo";

export const createOAuthState = () => crypto.randomUUID();

export const buildGoogleAuthUrl = (state: string) => {
  const url = new URL(googleAuthBaseUrl);

  url.searchParams.set("client_id", authEnv.googleClientId);
  url.searchParams.set("redirect_uri", authEnv.googleRedirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", authEnv.googleScopes);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);

  return url.toString();
};

export const exchangeCodeForTokens = async (code: string) => {
  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: authEnv.googleClientId,
      client_secret: authEnv.googleClientSecret,
      redirect_uri: authEnv.googleRedirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange Google OAuth code for tokens");
  }

  return (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
    token_type: string;
    scope: string;
  };
};

export const fetchGoogleUserProfile = async (accessToken: string) => {
  const response = await fetch(googleUserInfoUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Google account details");
  }

  return (await response.json()) as GoogleUserProfile;
};
