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
  
  // 1. ISOLATED SINGLE-LOOKUP LAYER: Absolute priority matching
  const hasAppointmentId = appointmentId && appointmentId !== "null" && appointmentId !== "undefined";
  const hasBookingCode = bookingCode && bookingCode !== "null" && bookingCode !== "undefined";

  if (hasAppointmentId) {
    return await api<Appointment>(`/api/vet/appointments/${appointmentId}`, {
      method: "GET",
      token,
    });
  }

  if (hasBookingCode) {
    return await api<Appointment>(`/api/vet/admin/appointment/${bookingCode}`, {
      method: "GET",
      token,
    });
  }

  // 2. STRICT COLLECTION LAYER: Triggers only for broad list queries
  // Guard Clause: Stops execution immediately if the role hasn't loaded yet, preventing shared lists
  if (!role || role === "null" || role === "undefined") {
    throw new Error("Cannot fetch appointments collection: User role context is still initializing.");
  }
  
  // Normalize string cases for route dictionary mapping securely
  const normalizedRole = String(role).toUpperCase();
  const roleType = ROLE_ROUTE_MAP[normalizedRole] || "customer";

  // 3. Process query parameter collection filters safely
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

  // 4. Fetch segregated collection array path routed via active user role slug
  return await api<GetMyAppointmentHistoryResponse | GetAllAppointmentsResponse>(
    `/api/vet/${roleType}/appointments${queryParams}`, 
    {
      method: "GET",
      token,
    }
  );
}
