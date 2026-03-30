import { authEnv } from "@/lib/auth/env";

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH";
  query?: Record<string, string>;
  body?: unknown;
  prefer?: string[];
};

export const supabaseRequest = async <T>(
  table: string,
  options: RequestOptions = {},
) => {
  const url = new URL(`${authEnv.supabaseUrl}/rest/v1/${table}`);

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      apikey: authEnv.supabaseServiceRoleKey,
      Authorization: `Bearer ${authEnv.supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: [...(options.prefer ?? []), "return=representation"].join(","),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase request failed: ${errorText}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
};
