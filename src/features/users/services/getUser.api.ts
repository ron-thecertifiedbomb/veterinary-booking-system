
import { api } from "@/utils/api/api.client";
import { GetUserResponse } from "../types/types";


export async function getUser(
  token: string,
): Promise<GetUserResponse> {
  return api<GetUserResponse>("/api/vet/users/me", {
    method: "GET",
    token,
  });
}
