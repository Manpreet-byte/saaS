import { AppUser, GoogleUserProfile, UserRole } from "@/lib/auth/types";
import { supabaseRequest } from "@/lib/db/supabase-admin";

const usersTable = "users";

export const getUserById = async (id: string) => {
  const users = await supabaseRequest<AppUser[]>(usersTable, {
    query: {
      id: `eq.${id}`,
      select: "*",
      limit: "1",
    },
  });

  return users[0] ?? null;
};

export const getUserByEmail = async (email: string) => {
  const users = await supabaseRequest<AppUser[]>(usersTable, {
    query: {
      email: `eq.${email}`,
      select: "*",
      limit: "1",
    },
  });

  return users[0] ?? null;
};

export const listUsers = async () =>
  supabaseRequest<AppUser[]>(usersTable, {
    query: {
      select: "id,business_name,email,google_account_id,role,created_at,updated_at",
      order: "created_at.desc",
    },
  });

export const upsertGoogleUser = async (profile: GoogleUserProfile) => {
  const existingUser = await getUserByEmail(profile.email);
  const role: UserRole = existingUser?.role ?? "user";
  const businessName =
    existingUser?.business_name ?? profile.name ?? profile.email.split("@")[0];

  const users = await supabaseRequest<AppUser[]>(usersTable, {
    method: "POST",
    query: {
      on_conflict: "email",
    },
    prefer: ["resolution=merge-duplicates"],
    body: {
      email: profile.email,
      business_name: businessName,
      google_account_id: profile.sub,
      role,
    },
  });

  return users[0];
};

export const updateUserRole = async (id: string, role: UserRole) => {
  const users = await supabaseRequest<AppUser[]>(usersTable, {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
    },
    body: { role },
  });

  return users[0] ?? null;
};
