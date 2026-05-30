import { Platform } from "react-native";

import { routes } from "@/utils/routes/constants/routes";

type Role = "USER" | "ADMIN" | "STAFF";

type PlatformType = "web" | "app";

type RouteOptions = {
  isAuthenticated?: boolean;
};

// ✅ auto detect platform
function getPlatform(): PlatformType {
  return Platform.OS === "web" ? "web" : "app";
}

// ✅ centralized auth + role routing
export function getRouteByRole(
  role?: Role,
  { isAuthenticated = false }: RouteOptions = {},
) {
  const platform = getPlatform();

  // ✅ guest/public route
  if (!isAuthenticated || !role) {
    return routes.public[platform];
  }

  switch (role) {
    case "ADMIN":
      return routes.admin[platform];

    case "STAFF":
      return routes.admin[platform];

    case "USER":
    default:
      return routes.user[platform];
  }
}
