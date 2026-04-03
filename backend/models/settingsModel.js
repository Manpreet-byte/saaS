export const settingsSchema = {
  table: "settings",
  columns: {
    id: "integer",
    auto_response_enabled: "boolean",
    tone: "text",
    created_at: "timestamptz",
    updated_at: "timestamptz",
  },
  defaultRow: {
    id: 1,
    auto_response_enabled: false,
    tone: "friendly",
  },
  constraints: [
    "tone in ('friendly', 'professional', 'apologetic')",
  ],
};
