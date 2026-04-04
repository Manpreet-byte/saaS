import { settingsSchema } from "../models/settingsModel.js";
import { supabaseRequest } from "../db/supabaseClient.js";

const settingsTable = settingsSchema.table;

export const getSettings = async () => {
  const rows = await supabaseRequest(settingsTable, {
    query: {
      select: "id,auto_response_enabled,tone,created_at,updated_at",
      id: "eq.1",
      limit: "1",
    },
  });

  if (rows?.[0]) {
    return rows[0];
  }

  const created = await upsertSettings(settingsSchema.defaultRow);
  return created ?? settingsSchema.defaultRow;
};

export const upsertSettings = async (updates = {}) => {
  const rows = await supabaseRequest(settingsTable, {
    method: "POST",
    query: {
      on_conflict: "id",
    },
    prefer: ["resolution=merge-duplicates"],
    body: {
      ...settingsSchema.defaultRow,
      ...updates,
      id: 1,
    },
  });

  return rows?.[0] ?? null;
};

export const updateSettings = async (updates) => upsertSettings(updates);

export const isAutoResponseEnabled = async () => {
  const settings = await getSettings();
  return Boolean(settings?.auto_response_enabled);
};
