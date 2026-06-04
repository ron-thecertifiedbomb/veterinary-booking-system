
import { RegisterPayload, RegistrationResponse } from "@/features/auth/types/auth.registration";
import { api } from "@/utils/api/api.client";

export async function registerApi(
  payload: RegisterPayload,
): Promise<RegistrationResponse> {
  return api<RegistrationResponse>("/api/vet/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
