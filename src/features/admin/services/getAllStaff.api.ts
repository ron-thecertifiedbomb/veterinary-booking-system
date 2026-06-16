import {
  GetPetsResponse,
} from "@/features/pet/pet.types";
import { GetAllStaffResponse } from "@/features/staff/types/staff.types";
import { api } from "@/utils/api/api.client";

export async function getAllStaffApi(token: string): Promise<GetAllStaffResponse> {
  return api<GetAllStaffResponse>("/api/vet/admin/staff", {
    method: "GET",
    token,
  });
}
