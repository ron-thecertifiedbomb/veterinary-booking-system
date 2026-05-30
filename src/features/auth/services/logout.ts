// src/features/auth/services/logout.ts

import { api } from "@/utils/api";
import { logger } from "@/utils/logger";

type LogoutDependencies = {
  token: string | null;

  setLoading: (value: boolean) => void;

  setUser: (user: null) => void;

  setToken: (token: string | null) => void;

  clearSessionCache: () => void;

  removeStorageItem: (key: string) => Promise<void>;
};

export async function logout({
  token,
  setLoading,
  setUser,
  setToken,
  clearSessionCache,
  removeStorageItem,
}: LogoutDependencies) {
  try {
    setLoading(true);

    logger.info("Logging out user");

    let response = null;

    if (token) {
      response = await api("/api/vet/auth/logout", {
        method: "POST",
        token,
      });
    }

    return response;
  } catch (error: any) {
    logger.error("Logout API failed", error);

    return null;
  } finally {
    await Promise.all([
      removeStorageItem("user"),

      removeStorageItem("access_token"),
    ]);

    clearSessionCache();

    setUser(null);

    setToken(null);

    setLoading(false);

    logger.info("User session cleared");
  }
}
