const requiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

export const authEnv = {
  get appUrl() {
    return (
      process.env.NEXT_PUBLIC_APP_URL ??
      process.env.APP_URL ??
      "http://localhost:3000"
    );
  },
  get jwtSecret() {
    return requiredEnv("JWT_SECRET");
  },
  get googleClientId() {
    return requiredEnv("GOOGLE_CLIENT_ID");
  },
  get googleClientSecret() {
    return requiredEnv("GOOGLE_CLIENT_SECRET");
  },
  get googleRedirectUri() {
    return requiredEnv("GOOGLE_REDIRECT_URI");
  },
  get supabaseUrl() {
    return requiredEnv("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get sessionCookieName() {
    return process.env.SESSION_COOKIE_NAME ?? "gr_session";
  },
  get oauthStateCookieName() {
    return process.env.OAUTH_STATE_COOKIE_NAME ?? "gr_oauth_state";
  },
  get jwtExpiresInSeconds() {
    return Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 60 * 60 * 24);
  },
  get googleScopes() {
    return (
      process.env.GOOGLE_SCOPES ??
      [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/business.manage",
      ].join(" ")
    );
  },
};
