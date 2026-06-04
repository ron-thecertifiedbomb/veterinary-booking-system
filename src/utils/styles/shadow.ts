// ..\src\utils\styles\shadow.ts

import { Platform } from "react-native";

export function getSidebarShadow(strength: "light" | "medium" = "light") {
  if (Platform.OS === "web") {
    const presets = {
      light: "0px 2px 8px rgba(0,0,0,0.08)",
      medium: "0px 6px 18px rgba(0,0,0,0.15)",
    };

    return { boxShadow: presets[strength] };
  }

  return {
    shadowColor: "#000",
    shadowOpacity: strength === "light" ? 0.05 : 0.1,
    shadowRadius: strength === "light" ? 10 : 20,
  };
}
``;
