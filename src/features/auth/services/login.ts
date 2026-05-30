// src/features/auth/services/login.ts

import { api } from "@/utils/api";
import { logger } from "@/utils/logger";

import { AuthUser, LoginPayload, LoginResponse } from "@/features/auth/types";

type LoginDependencies = {
  setLoading: (value: boolean) => void;
  setSession: (user: AuthUser, token: string) => Promise<void>;
};

export async function login(
  payload: LoginPayload,
  { setLoading, setSession }: LoginDependencies,
): Promise<LoginResponse> {
  try {
    setLoading(true);

    const response = await api<LoginResponse>("/api/vet/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const normalizedUser = {
      ...response.user,
      userId: response.user.userId || response.user.id,
    };

    await setSession(normalizedUser, response.access_token);

    logger.info("Login successful via AuthProvider", normalizedUser);

    return response;
  } finally {
    setLoading(false);
  }
}
