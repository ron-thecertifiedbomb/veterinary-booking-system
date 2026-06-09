
import { api } from "@/utils/api/api.client";
import { fetchCustomerProfileResponse } from "../types/customer.types";

export async function fetchProfileApi(
  token: string,
): Promise<fetchCustomerProfileResponse> {
  return api<fetchCustomerProfileResponse>("/api/vet/users/me", {
    method: "GET",
    token,
  });
}
