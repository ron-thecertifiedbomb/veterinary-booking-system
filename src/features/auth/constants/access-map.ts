// features/auth/constants/access-map.ts

export type UserRole = "USER" | "ADMIN";

type RouteAccess = {
  roles: UserRole[];
  fallback?: string; // where to send unauthorized users
};

export const ACCESS_MAP: Record<string, RouteAccess> = {
  // USER APP (mobile)
  "(app)": {
    roles: ["USER"],
    fallback: "/(auth)/login",
  },

  // USER WEB
  "(web)": {
    roles: ["USER"],
    fallback: "/(auth)/login",
  },

  // ADMIN MOBILE APP
  "(admin-app)": {
    roles: ["ADMIN"],
    fallback: "/(app)",
  },

  // ADMIN WEB DASHBOARD
  "(admin-web)": {
    roles: ["ADMIN"],
    fallback: "/(app)",
  },
};
