
import { AuthenticatedUserResponse } from "@/features/auth/types/auth.types";
import { api } from "@/utils/api/api.client";

export async function fetchMe(
  token: string,
): Promise<AuthenticatedUserResponse> {
  return api<AuthenticatedUserResponse>("/api/vet/auth/me", {
    method: "GET",
    token,
  });
}
