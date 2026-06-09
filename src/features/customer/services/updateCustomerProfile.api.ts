
import { api } from "@/utils/api/api.client";
import { fetchCustomerProfileResponse, updateCustomerProfilePayload, UpdateCustomerProfileResponse } from "../types/customer.types";

export async function updateCustomerProfileApi(
    payload: updateCustomerProfilePayload,
  token: string,
): Promise<UpdateCustomerProfileResponse> {
  return api<UpdateCustomerProfileResponse>("/api/vet/users/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}
