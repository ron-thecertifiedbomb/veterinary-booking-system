import { LoginPayload, LoginResponse } from "@/features/auth/types/auth.login";
import { api } from "@/utils/api/api.client";

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  return api<LoginResponse>("/api/vet/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
