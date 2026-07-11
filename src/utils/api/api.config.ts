import { logger } from "@/utils/logger/logger";
import Constants from "expo-constants";
import { Platform } from "react-native";

const appEnv = process.env.EXPO_PUBLIC_APP_ENV || process.env.NODE_ENV;

const extra = Constants.expoConfig?.extra as
  | { apiWeb?: string; apiMobile?: string }
  | undefined;

const API_WEB = process.env.EXPO_PUBLIC_API_WEB || extra?.apiWeb;
const API_MOBILE = process.env.EXPO_PUBLIC_API_MOBILE || extra?.apiMobile;

const DEV_FALLBACK = "http://localhost:3000";

function resolveApi(): string {
  const selected =
    Platform.OS === "web"
      ? extra?.apiWeb || API_WEB
      : extra?.apiMobile || API_MOBILE;

  if (selected) {
    if (__DEV__ && Platform.OS !== "web" && selected.includes("localhost")) {
      logger.warn(
        "localhost will not work on a physical device — use your LAN IP in EXPO_PUBLIC_API_MOBILE",
      );
    }
    return selected;
  }

  if (__DEV__) {
    logger.warn(
      `EXPO_PUBLIC_API_${Platform.OS === "web" ? "WEB" : "MOBILE"} not set — using ${DEV_FALLBACK}`,
    );
    return DEV_FALLBACK;
  }

  throw new Error(
    `[API CONFIG ERROR] Missing EXPO_PUBLIC_API_${Platform.OS === "web" ? "WEB" : "MOBILE"} for ${appEnv}`,
  );
}

export const API = resolveApi();

if (__DEV__) {
  logger.info("API config", {
    env: appEnv,
    platform: Platform.OS,
    api: API,
  });
}
