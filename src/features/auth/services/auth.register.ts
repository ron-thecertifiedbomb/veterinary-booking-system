import {
  RegisterPayload,
  RegisterResponse,
} from "@/features/auth/types/auth.types";

import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";

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
      ...response.data,
      userId: response.data.userId,
    };

    logger.info("Registration successful via AuthProvider", normalizedUser);

    return response;
  } finally {
    setLoading(false);
  }
}
