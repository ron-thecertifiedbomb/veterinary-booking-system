import { Platform } from "react-native";
import { logger } from "@/utils/logger";

const platform = Platform.OS;

logger.info("Running on platform", platform);

export const API =
  Platform.OS === "web"
    ? "http://localhost:3000"
    : "http://192.168.100.43:3000"