import { GetAllCustomerResponse } from "@/features/customer/types/customer.types";
import { api } from "@/utils/api/api.client";

export async function getAllCustomerApi(token: string): Promise<GetAllCustomerResponse> {
  return api<GetAllCustomerResponse>("/api/vet/admin/customers", {
    method: "GET",
    token,
  });
}
