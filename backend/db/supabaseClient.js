import { backendEnv } from "../utils/env.js";

const buildUrl = (table, query = {}) => {
  const url = new URL(`${backendEnv.supabaseUrl}/rest/v1/${table}`);

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url;
};

export const supabaseRequest = async (table, options = {}) => {
  const url = buildUrl(table, options.query);
  const prefer = [...(options.prefer ?? []), "return=representation"];

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      apikey: backendEnv.supabaseServiceRoleKey,
      Authorization: `Bearer ${backendEnv.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: prefer.join(","),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};

export const supabaseCount = async (table, query = {}) => {
  const url = buildUrl(table, query);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: backendEnv.supabaseServiceRoleKey,
      Authorization: `Bearer ${backendEnv.supabaseServiceRoleKey}`,
      Prefer: "count=exact",
      Range: "0-0",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase count request failed: ${errorText}`);
  }

  const contentRange = response.headers.get("content-range");

  if (!contentRange) {
    return 0;
  }

  const total = contentRange.split("/")[1] ?? "0";
  return Number(total);
};
