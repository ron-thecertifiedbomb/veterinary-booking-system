
import { api } from "@/utils/api/api.client";
import { UpdateUserProfilePayload, UpdateUserProfileResponse } from "../types/user.types";

export async function updateUserProfileApi(
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
