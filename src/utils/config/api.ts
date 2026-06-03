// import { logger } from "@/utils/logger/logger";
// import { Platform } from "react-native";

// const platform = Platform.OS;

// logger.info("Running on platform", platform);

// export const API =
//   Platform.OS === "web"
//     ? "http://localhost:3000"
//     : "http://192.168.100.43:3000";

import { logger } from "@/utils/logger/logger";
import { Platform } from "react-native";

const isProd = process.env.NODE_ENV === "production";

const API_WEB = process.env.EXPO_PUBLIC_API_WEB;
const API_MOBILE = process.env.EXPO_PUBLIC_API_MOBILE;
const API_PROD = process.env.EXPO_PUBLIC_API_PROD;

// ✅ Final API (with fallback)
export const API =
  (isProd ? API_PROD : Platform.OS === "web" ? API_WEB : API_MOBILE) ||
  "http://localhost:3000";

// ✅ LOGGER (clean + grouped)
if (__DEV__) {
  logger.info("🌐 API CONFIG", {
    env: process.env.NODE_ENV,
    platform: Platform.OS,
    api: API,
    mode: isProd ? "PRODUCTION" : "DEVELOPMENT",
  });
}