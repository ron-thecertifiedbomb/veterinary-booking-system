// ..\src\features\appointment\services\slots.ts
import { GetAllAppointmentsResponse } from "@/features/admin/types/admin.types";
import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { api } from "@/utils/api/api.client";


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
  activeRole?: string,
  bookingCode?: string,
) {

  if (appointmentId) {
    return await api<Appointment>(`/api/vet/appointment/${appointmentId}`, {
      method: "GET",
      token,
    });
  }

  else if (bookingCode) {
    return await api<Appointment>(`/api/vet/appointments/${bookingCode}`, {
      method: "GET",
      token,
    });
  }

  let roleType;

  switch (activeRole) {
    case "ADMIN":
      roleType = "admin";
      break;
    case "STAFF":
      roleType = "staff";
      break;
    case "CUSTOMER":
    default:
      roleType = "customer";
      break;
  }
  
  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) cleanFilters[key] = String(val);
    });
  }

  const queryParams = Object.keys(cleanFilters).length > 0
    ? "?" + new URLSearchParams(cleanFilters).toString()
    : "";

  return await api<GetMyAppointmentHistoryResponse | GetAllAppointmentsResponse>(`/api/vet/${roleType}/appointments${queryParams}`, {
    method: "GET",
    token,
  });
}