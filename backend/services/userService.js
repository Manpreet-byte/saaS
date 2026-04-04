import { supabaseCount, supabaseRequest } from "../db/supabaseClient.js";

const usersTable = "users";

export const listUsers = async () =>
  supabaseRequest(usersTable, {
    query: {
      select: "id,business_name,email,google_account_id,role,created_at,updated_at",
      order: "created_at.desc",
    },
  });

export const countUsers = async () => supabaseCount(usersTable);
