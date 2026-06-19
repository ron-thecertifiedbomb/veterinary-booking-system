import { api } from "@/utils/api/api.client";

interface AssignStaffPayload {
  staffId: string | null; // FIX 1: Updated to match optional/nullable clinical values
}

interface AssignStaffResponse {
  message: string;
  data: any; 
}

/**
 * Submits a PATCH request to link a staff member to an unassigned appointment slot.
 * Triggers backend validations to block same-day double-bookings.
 */
export async function assignStaffToAppointmentApi(
  bookingCode: string,
  staffId: string | null, // FIX 2: Removed optional '?' operator to enforce clear payload signatures
  token: string
): Promise<AssignStaffResponse> {
  // Safe payload declaration with exact matching types
  const payload: AssignStaffPayload = { staffId };

  return await api<AssignStaffResponse>(
    `/api/vet/admin/appointment/${bookingCode}/assign`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload), 
    }
  );
}
