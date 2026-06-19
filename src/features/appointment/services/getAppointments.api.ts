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

// Consolidated configuration payload with safe null and undefined bindings
export interface GetAppointmentsPayload {
  token: string;
  filters?: GetAppointmentsFilters | null;
  appointmentId?: string | null;
  role?: string | null;
  bookingCode?: string | null;
}

const ROLE_ROUTE_MAP: Record<string, string> = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

export async function getAppointmentsApi({
  token,
  filters,
  appointmentId,
  role,
  bookingCode,
}: GetAppointmentsPayload) {
  
  const roleType = ROLE_ROUTE_MAP[role || ""] || "customer";

  // 1. Single resource lookups with absolute string validation guards
  if (appointmentId && appointmentId !== "null" && appointmentId !== "undefined") {
    return await api<Appointment>(`/api/vet/appointments/${appointmentId}`, {
      method: "GET",
      token,
    });
  }

  if (bookingCode && bookingCode !== "null" && bookingCode !== "undefined") {
    return await api<Appointment>(`/api/vet/admin/appointment/${bookingCode}`, {
      method: "GET",
      token,
    });
  }
  
  // 2. Process query parameter collection filters safely
  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "null" && val !== "undefined") {
        cleanFilters[key] = String(val);
      }
    });
  }

  const queryParams = Object.keys(cleanFilters).length > 0
    ? "?" + new URLSearchParams(cleanFilters).toString()
    : "";

  // 3. Fetch full collection array fallback path
  return await api<GetMyAppointmentHistoryResponse | GetAllAppointmentsResponse>(
    `/api/vet/${roleType}/appointments${queryParams}`, 
    {
      method: "GET",
      token,
    }
  );
}
