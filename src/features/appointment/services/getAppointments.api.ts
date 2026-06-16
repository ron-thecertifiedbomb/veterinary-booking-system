// ..\src\features\appointment\services\slots.ts

import { GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { api } from "@/utils/api/api.client";

// Define a type for the query parameters
export interface GetAppointmentsFilters {
  from?: string;
  to?: string;
  sortBy?: "appointmentDate" | "status" | string;
  sortOrder?: "asc" | "desc";
}

export async function getAppointmentsApi(
  token: string, 
  filters?: GetAppointmentsFilters
) {

  const queryParams = filters 
    ? "?" + new URLSearchParams(filters as Record<string, string>).toString()
    : "";
  return await api<GetMyAppointmentHistoryResponse>(`/api/vet/users/appointments${queryParams}`, {
    method: "GET",
    token,
  });
}
