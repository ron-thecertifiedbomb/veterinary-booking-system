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

// Payload interfaces tailored precisely to each distinct endpoint task
export interface GetAppointmentsPayload {
  token: string;
  role: string | null; // Required to eliminate mixed matching array fallbacks
  filters?: GetAppointmentsFilters | null;
}

export interface GetAppointmentByIdPayload {
  token: string;
  appointmentId: string;
}

export interface GetAppointmentByBookingCodePayload {
  token: string;
  bookingCode: string;
}

const ROLE_ROUTE_MAP: Record<string, string> = {
  ADMIN: "admin",
  STAFF: "staff",
  CUSTOMER: "customer",
};

/**
 * 1. FETCH FULL COLLECTION ARRAY BY ROLE
 * Targets matching role paths specifically (/api/vet/customer/appointments, etc.)
 */
export async function getAppointmentsApi({
  token,
  role,
  filters,
}: GetAppointmentsPayload) {
  if (!role || role === "null" || role === "undefined") {
    throw new Error("Cannot fetch appointments collection: Valid role parameter is required.");
  }

  const normalizedRole = String(role).toUpperCase();
  const roleType = ROLE_ROUTE_MAP[normalizedRole] || "customer";

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

  return await api<GetMyAppointmentHistoryResponse | GetAllAppointmentsResponse>(
    `/api/vet/${roleType}/appointments${queryParams}`,
    {
      method: "GET",
      token,
    }
  );
}

/**
 * 2. FETCH SINGLE RESOURCE BY ID
 * Isolated endpoint pattern for generic resource lookups
 */
export async function getAppointmentByIdApi({
  token,
  appointmentId,
}: GetAppointmentByIdPayload) {
  if (!appointmentId || appointmentId === "null" || appointmentId === "undefined") {
    throw new Error("Missing or invalid appointmentId provided.");
  }

  return await api<Appointment>(`/api/vet/appointments/${appointmentId}`, {
    method: "GET",
    token,
  });
}

/**
 * 3. FETCH SINGLE RESOURCE BY BOOKING CODE
 * Isolated administrative tracking deep lookup endpoint
 */
export async function getAppointmentByBookingCodeApi({
  token,
  bookingCode,
}: GetAppointmentByBookingCodePayload) {
  if (!bookingCode || bookingCode === "null" || bookingCode === "undefined") {
    throw new Error("Missing or invalid bookingCode provided.");
  }

  return await api<Appointment>(`/api/vet/admin/appointment/${bookingCode}`, {
    method: "GET",
    token,
  });
}
