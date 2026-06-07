import { AdminFormData, CreateAdminResponse } from "@/features/admin/types/admin.types";

import { api } from "@/utils/api/api.client";

export async function addAdminApi(
  payload: AdminFormData, token: string
): Promise<CreateAdminResponse> {
  return api<CreateAdminResponse>("/api/vet/admin/admins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
