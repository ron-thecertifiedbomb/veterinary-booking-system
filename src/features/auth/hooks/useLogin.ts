// src/features/auth/hooks/useLogin.ts

import { useState } from "react";
import Toast from "react-native-toast-message";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { setStorageItem } from "@/features/auth/storage";
import { useAuth } from "@/features/auth/providers/AuthProvider"; // ✓ add
import { LoginPayload, LoginResponse } from "@/features/auth/types";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { setSession } = useAuth(); // ✓ add

  const login = async (
    payload: LoginPayload,
  ): Promise<LoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      logger.info("Attempting login", { email: payload.email });

      const response = await api<LoginResponse>("/api/vet/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const normalizedUser = {
        ...response.user,
        userId: response.user.userId || response.user.id,
      };

      // ✓ save to storage
      await setStorageItem("access_token", response.access_token);
      await setStorageItem("user", JSON.stringify(normalizedUser));

      // ✓ update AuthProvider state so layouts re-render immediately
      await setSession(normalizedUser, response.access_token);

      logger.info("Login successful", normalizedUser);

      setMessage(response.message);

      Toast.show({ type: "success", text1: response.message });

      return response;
    } catch (err: any) {
      logger.error("Login failed", err);
      const errorMessage = err?.message || "Failed to login";
      setError(errorMessage);
      Toast.show({ type: "error", text1: errorMessage });
      return null;
    } finally {
      setLoading(false);
      logger.info("Login request completed");
    }
  };

  return { login, loading, error, message };
}
