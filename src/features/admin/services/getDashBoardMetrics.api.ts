
import { api } from "@/utils/api/api.client";
import { DashboardMetricsResponse } from "../types/admin.types";


export async function getGetDashBoardMetricsApi(
  token: string, 
) {
  return await api<DashboardMetricsResponse>(`/api/vet/admin/dashboard/metrics`, {
    method: "GET",
    token,
  });
}

