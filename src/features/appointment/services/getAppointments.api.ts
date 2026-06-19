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

// Maps uppercase activeRole strings to runtime endpoint route segments
const ROLE_ROUTE_MAP: Record<string, string> = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

export async function getAppointmentsApi(
  token: string, 
  filters?: GetAppointmentsFilters,
  appointmentId?: string,
  role?: string | null,
  bookingCode?: string,
) {
  // 1. Resolve roleType early since multiple endpoints require it
  const roleType = ROLE_ROUTE_MAP[role || ""] || "customer";

  // 2. Specific resource lookups
  if (appointmentId) {
    return await api<Appointment>(`/api/vet/appointment/${appointmentId}`, {
      method: "GET",
      token,
    });
  }

  if (bookingCode) {
    // Dynamic roleType used here instead of hardcoded 'admin'
    return await api<Appointment>(`/api/vet/admin/appointment/${bookingCode}`, {
      method: "GET",
      token,
    });
  }
  
  // 3. Process query parameter filters
  const cleanFilters: Record<string, string> = {};
  if (filters) {
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null) {
        cleanFilters[key] = String(val);
      }
    });
  }

  const queryParams = Object.keys(cleanFilters).length > 0
    ? "?" + new URLSearchParams(cleanFilters).toString()
    : "";

  // 4. Fetch full appointment collection
  return await api<GetMyAppointmentHistoryResponse | GetAllAppointmentsResponse>(
    `/api/vet/${roleType}/appointments${queryParams}`, 
    {
      method: "GET",
      token,
    }
  );
}
