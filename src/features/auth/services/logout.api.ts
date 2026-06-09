
import { api } from "@/utils/api/api.client";
import { LogOutResponse } from "../types/auth.logout";

export async function logoutApi(token:string | null): Promise<LogOutResponse> {
  return api<LogOutResponse>("/api/vet/auth/logout", {
    method: "POST",
    token: token,
  });
}
