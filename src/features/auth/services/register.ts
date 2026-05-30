import { RegisterPayload, RegisterResponse } from "@/features/auth/types";

import { api } from "@/utils/api";
import { logger } from "@/utils/logger";

type RegisterDependencies = {
  setLoading: (value: boolean) => void;
};

export async function register(
  payload: RegisterPayload,
  { setLoading }: RegisterDependencies,
): Promise<RegisterResponse> {
  try {
    setLoading(true);

    logger.info("Attempting registration via AuthProvider", {
      email: payload.email,
    });

    const response = await api<RegisterResponse>("/api/vet/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const normalizedUser = {
      ...response.user,
      userId: response.user.userId || response.user.id,
    };

    logger.info("Registration successful via AuthProvider", normalizedUser);

    return response;
  } finally {
    setLoading(false);
  }
}
