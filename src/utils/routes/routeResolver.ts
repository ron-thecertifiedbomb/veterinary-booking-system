// ..\src\utils\routes\routeResolver.ts

import { Href } from "expo-router";
import { Platform } from "react-native";

// ==========================
// Types
// ==========================
export type Role = "CUSTOMER" | "ADMIN" | "STAFF";
type PlatformType = "web" | "app";

type PlatformRoutes = {
  web: Href;
  app: Href;
};

// ==========================
// Route Registry
// ==========================
export const routes = {
  admin: {
    web: "/(admin-web)/dashboard",
    app: "/(admin-app)/dashboard",
  },
  staff: {
    web: "/(staff-web)/(tabs)/dashboard",
    app: "/(staff-app)/(tabs)/dashboard",
  },
  customer: {
    web: "/(web)/web-home",
    app: "/(app)/(tabs)/home",
  },
  public: {
    web: "/(auth)/login",
    app: "/(auth)/login",
  },
} as const;

// ==========================
// Role Mapping
// ==========================
const roleRouteKeyMap: Record<Role, keyof typeof routes> = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

// ==========================
// Platform Policy
// ==========================
const platformPolicy: Record<Role, PlatformType[]> = {
  ADMIN: ["web"],
  STAFF: ["app"],
  CUSTOMER: ["web", "app"],
};

// ==========================
// Main Router (PURE)
// ==========================
export function getRouteByRole(
  role: Role | undefined,
  isAuthenticated: boolean,
): Href {
  const platform: PlatformType = Platform.OS === "web" ? "web" : "app";
  const fallback = routes.public[platform];

  // Guard: auth required
  if (!isAuthenticated || !role) {
    return fallback;
  }

  // Guard: platform restriction
  if (!platformPolicy[role].includes(platform)) {
    return fallback;
  }

  // Resolve route
  const routeKey = roleRouteKeyMap[role];
  return routes[routeKey][platform];
}
