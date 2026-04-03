import { UserRole } from "@/lib/auth/types";

const roleHierarchy: Record<UserRole, number> = {
  user: 1,
  manager: 2,
  admin: 3,
};

export const hasRequiredRole = (
  currentRole: UserRole,
  requiredRole: UserRole,
) => roleHierarchy[currentRole] >= roleHierarchy[requiredRole];

export const hasAnyRole = (
  currentRole: UserRole,
  allowedRoles: UserRole[],
) => allowedRoles.some((role) => hasRequiredRole(currentRole, role));
