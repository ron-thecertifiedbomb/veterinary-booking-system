
import { GetAllCustomerResponse } from "@/features/customer/types/customer.types";
import { GetAllStaffResponse } from "@/features/staff/types/staff.types";
import { api } from "@/utils/api/api.client";

export async function getAllCustomerApi(token: string): Promise<GetAllStaffResponse> {
  return api<GetAllCustomerResponse>("/api/vet/admin/customers", {
    method: "GET",
    token,
  });
}
