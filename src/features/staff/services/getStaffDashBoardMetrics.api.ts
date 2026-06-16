
import { api } from "@/utils/api/api.client";
import { DashboardStatsResponse } from "../types/staff.types";


export async function getStaffDashBoardMetricsApi(
  token: string, 
) {
  return await api<DashboardStatsResponse>(`/api/vet/staff/dashboard/stats`, {
    method: "GET",
    token,
  });
}



export type DashboardStatsData = {
  totalAssigned: number;
  completed: number;
  inProgress: number;
  upcoming: number;
};