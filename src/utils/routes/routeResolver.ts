import { Platform } from "react-native";

import { routes } from "@/utils/routes/constants/routes";

type Role = "USER" | "ADMIN" | "STAFF";

type PlatformType = "web" | "app";

// ✅ auto detect current platform
function getPlatform(): PlatformType {
  return Platform.OS === "web" ? "web" : "app";
}

// ✅ centralized role routing
export function getRouteByRole(role: Role) {
  const platform = getPlatform();

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
