
import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { api } from "@/utils/api/api.client";


export interface GetAllAppointmentsFilters {
  from?: string;
  to?: string;
  sortBy?: "appointmentDate" | "status" | string;
  sortOrder?: "asc" | "desc";
}

export async function getAppointmentsApi(
  token: string, 
  filters?: GetAllAppointmentsFilters,

) {

  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) cleanFilters[key] = String(val);
    });
  }

  const queryParams = Object.keys(cleanFilters).length > 0
    ? "?" + new URLSearchParams(cleanFilters).toString()
    : "";

  return await api<GetMyAppointmentHistoryResponse>(`/api/vet/admin/appointments${queryParams}`, {
    method: "GET",
    token,
  });
}