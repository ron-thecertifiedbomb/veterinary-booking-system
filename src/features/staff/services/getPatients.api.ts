
import { api } from "@/utils/api/api.client";
import { AssignedPatientsResponse, DashboardStatsResponse } from "../types/staff.types";


export async function getPatientsApi(
  token: string, 
) {
  return await api<AssignedPatientsResponse>(`/api/vet/staff/patients`, {
    method: "GET",
    token,
  });
}


