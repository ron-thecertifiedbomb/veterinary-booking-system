import { logger } from "@/utils/logger/logger";
import { Platform } from "react-native";

const appEnv = process.env.EXPO_PUBLIC_APP_ENV || process.env.NODE_ENV;

const API_WEB = process.env.EXPO_PUBLIC_API_WEB;
const API_MOBILE = process.env.EXPO_PUBLIC_API_MOBILE;

function resolveApi(): string {
  const selected = Platform.OS === "web" ? API_WEB : API_MOBILE;

  if (!selected) {
    throw new Error(`[API CONFIG ERROR] Missing API for ${appEnv}`);
  }

  if (__DEV__ && Platform.OS !== "web" && selected.includes("localhost")) {
    logger.warn(
      "⚠️ localhost will not work on mobile. Use LAN IP (192.168.x.x)",
    );
  }

  return selected;
}

export const API = resolveApi();

if (__DEV__) {
  logger.info("🌐 API CONFIG", {
    env: appEnv,
    platform: Platform.OS,
    source: Platform.OS === "web" ? "API_WEB" : "API_MOBILE",
    selectedApi: API,
  });
}
