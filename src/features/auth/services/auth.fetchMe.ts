// ..\src\features\auth\services\auth.fetchMe.ts

import { MeResponse } from "@/features/auth/types/auth.user";
import { api } from "@/utils/api/api.client";

export async function fetchMe(token: string): Promise<MeResponse> {
  const response = await api<MeResponse>("/api/vet/auth/me", {
    method: "GET",
    token,
  });

  return response;
}
