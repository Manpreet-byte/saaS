import { NextRequest, NextResponse } from "next/server";

import { UserRole } from "@/lib/auth/types";
import {
  attachUserToRequestHeaders,
  authenticateUser,
  authorizeRole,
} from "@/lib/api/jwt-middleware";

const routeAccessRules: Array<{
  prefixes: string[];
  roles?: UserRole[];
}> = [
  {
    prefixes: [
      "/api/users",
      "/api/dashboard",
      "/api/admin",
      "/settings",
      "/api/admin/logs",
    ],
    roles: ["admin"],
  },
  {
    prefixes: ["/api/reviews"],
    roles: ["manager", "admin"],
  },
  {
    prefixes: [
      "/dashboard",
      "/review-funnel",
      "/automated-responses",
      "/ai-suggestions",
      "/api/auth/me",
    ],
  },
];

const authenticatedPrefixes = [
  "/dashboard",
  "/review-funnel",
  "/automated-responses",
  "/ai-suggestions",
  "/api/auth/me",
];

const matchesPrefix = (pathname: string, prefixes: string[]) =>
  prefixes.some((prefix) => pathname.startsWith(prefix));

const deniedResponse = (request: NextRequest, status: 401 | 403) => {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json(
      { error: status === 401 ? "Unauthorized" : "Forbidden" },
      { status },
    );
  }

  const redirectUrl = new URL(
    status === 401 ? "/api/auth/google/login" : "/dashboard",
    request.url,
  );

  if (status === 403) {
    redirectUrl.searchParams.set("error", "forbidden");
  }

  return NextResponse.redirect(redirectUrl);
};

const findRouteRule = (pathname: string) =>
  routeAccessRules.find((rule) => matchesPrefix(pathname, rule.prefixes));

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const matchedRule = findRouteRule(pathname);

  if (!matchedRule && !matchesPrefix(pathname, authenticatedPrefixes)) {
    return NextResponse.next();
  }

  const session = await authenticateUser(request);

  if (!session) {
    return deniedResponse(request, 401);
  }

  if (!authorizeRole(session, matchedRule?.roles)) {
    return deniedResponse(request, 403);
  }

  return NextResponse.next({
    request: {
      headers: attachUserToRequestHeaders(request, session),
    },
  });
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/review-funnel/:path*",
    "/automated-responses/:path*",
    "/ai-suggestions/:path*",
    "/settings/:path*",
    "/api/auth/me",
    "/api/users/:path*",
    "/api/admin/:path*",
    "/api/reviews/:path*",
    "/api/dashboard/:path*",
  ],
};
