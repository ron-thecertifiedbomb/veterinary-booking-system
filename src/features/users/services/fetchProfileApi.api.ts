
import { fetchCustomerProfileResponse } from "@/features/customer/types/customer.types";
import { api } from "@/utils/api/api.client";


export async function fetchProfileApi(
  token: string,
): Promise<fetchCustomerProfileResponse> {
  return api<fetchCustomerProfileResponse>("/api/vet/users/me", {
    method: "GET",
    token,
  });
}
