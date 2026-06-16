// ..\src\features\appointment\services\slots.ts

import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { UserRole } from "@/features/auth/types/auth.user";
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
  filters?: GetAppointmentsFilters,
  appointmentId?: string,
  role?: UserRole
) {
  // 1. If an ID is passed, target the specific item endpoint directly
  if (appointmentId) {
    return await api<Appointment>(`/api/vet/appointments/${appointmentId}`, {
      method: "GET",
      token,
    });
  }

  const roleType = role === "STAFF" ? "staff" : "customer" 
  

  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) cleanFilters[key] = String(val);
    });
  }

  const queryParams = Object.keys(cleanFilters).length > 0
    ? "?" + new URLSearchParams(cleanFilters).toString()
    : "";

  return await api<GetMyAppointmentHistoryResponse>(`/api/vet/${roleType}/appointments${queryParams}`, {
    method: "GET",
    token,
  });
}