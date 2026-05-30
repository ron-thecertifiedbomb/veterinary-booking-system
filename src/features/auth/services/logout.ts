// src/features/auth/services/logout.ts

import { api } from "@/utils/api";
import { logger } from "@/utils/logger";

type LogoutDependencies = {
  loading: boolean;

  token: string | null;

  setLoading: (value: boolean) => void;

  setUser: (user: null) => void;

  setToken: (token: string | null) => void;

  clearSessionCache: () => void;

  // ✅ injected storage removers
  removeStorageItem: (key: string) => Promise<void>;
};

export async function logout({
  loading,
  token,
  setLoading,
  setUser,
  setToken,
  clearSessionCache,
  removeStorageItem,
}: LogoutDependencies) {
  if (loading) return null;

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
    // ✅ injected dependency
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
