
import { api } from "@/utils/api/api.client";
import { UpdateUserProfilePayload, UpdateUserProfileResponse } from "../types/types";

export async function updateProfileApi(
  token: string, payload: UpdateUserProfilePayload
): Promise<UpdateUserProfileResponse> {
  return api<UpdateUserProfileResponse>("/api/vet/users/me", {
    method: "PATCH",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
  });
}
