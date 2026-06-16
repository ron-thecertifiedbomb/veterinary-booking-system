import {
  StaffFormData,
} from "@/features/admin/types/admin.types";
import { CreateStaffResponse } from "@/features/staff/types/staff.types";

import { api } from "@/utils/api/api.client";

export async function addStaffApi(
  payload: StaffFormData, token: string
): Promise<CreateStaffResponse> {
  return api<CreateStaffResponse>("/api/vet/admin/staff", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}
