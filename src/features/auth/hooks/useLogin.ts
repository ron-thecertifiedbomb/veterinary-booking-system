// src/features/auth/hooks/useLogin.ts

import { useAuth } from "@/features/auth/providers/AuthProvider"; // ✓ add
import { LoginPayload, LoginResponse } from "@/features/auth/types";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { login: authLogin } = useAuth(); // ✓ Consume login from provider

  const login = async (
    payload: LoginPayload,
  ): Promise<LoginResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      logger.info("Attempting login", { email: payload.email });

      const response = await authLogin(payload); // Call the AuthProvider's login function

      // AuthProvider's login handles session, storage, and toasts.
      // Update local message if response is successful.
      if (response) {
        setMessage(response.message);
      }
      return response;
    } catch (err: any) {
      logger.error("Login failed", err);
      const errorMessage = err?.message || "Failed to login";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      logger.info("Login request completed");
    }
  };

  return { login, loading, error, message };
}
