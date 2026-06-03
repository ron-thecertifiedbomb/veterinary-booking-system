// src/features/auth/services/login.ts

import {
  AuthUser,
  LoginPayload,
  LoginResponse,
} from "@/features/auth/types/auth.types";
import { api } from "@/utils/api/api.client";

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
      ...response.data.user,
      userId: response.data.user.id,
    };

    await setSession(normalizedUser, response.data.access_token);

    return response;
  } finally {
    setLoading(false);
  }
}
