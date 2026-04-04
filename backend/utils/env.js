const requiredEnv = (key) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
};

const optionalEnv = (key, fallback = "") => process.env[key] ?? fallback;

export const backendEnv = {
  get supabaseUrl() {
    return requiredEnv("SUPABASE_URL");
  },
  get supabaseServiceRoleKey() {
    return requiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
  get openaiApiKey() {
    return optionalEnv("OPENAI_API_KEY");
  },
  get geminiApiKey() {
    return optionalEnv("GEMINI_API_KEY");
  },
  get aiProvider() {
    return optionalEnv("AI_PROVIDER", "auto");
  },
};
