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
    web: "/admin/dashboard/",
    app: "/admin/dashboard/",
  },
  staff: {
    web: "/(staff-app)/(tabs)/dashboard/",
    app: "/(staff-app)/(tabs)/dashboard/",
  },
  customer: {
    web: "/(web)/home",
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

type ProfileRoutes = {
  profile: Href;
  edit: Href;
};

export function getProfileRoutes(role: Role | undefined): ProfileRoutes {
  const platform: PlatformType = Platform.OS === "web" ? "web" : "app";

  if (role === "ADMIN") {
    return {
      profile: "/(admin-web)/admin/profile",
      edit: "/(admin-web)/admin/profile/edit",
    };
  }

  if (role === "STAFF") {
    return {
      profile: "/(staff-app)/(tabs)/profile",
      edit: "/(staff-app)/edit-profile",
    };
  }

  return {
    profile: platform === "web" ? "/(web)/profile" : "/(app)/(tabs)/profile",
    edit: platform === "web" ? "/(web)/profile/edit" : "/(app)/edit-profile",
  };
}
