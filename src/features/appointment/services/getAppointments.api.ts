// ..\src\features\appointment\services\slots.ts

import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
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
  appointmentId?: string // Optional ID param
) {
  // 1. If an ID is passed, target the specific item endpoint directly
  if (appointmentId) {
    return await api<Appointment>(`/api/vet/appointments/${appointmentId}`, {
      method: "GET",
      token,
    });
  }

  // 2. Otherwise fall back to list logic with filter parameters
  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) cleanFilters[key] = String(val);
    });
  }

  const queryParams = Object.keys(cleanFilters).length > 0
    ? "?" + new URLSearchParams(cleanFilters).toString()
    : "";

  return await api<GetMyAppointmentHistoryResponse>(`/api/vet/users/appointments${queryParams}`, {
    method: "GET",
    token,
  });
}