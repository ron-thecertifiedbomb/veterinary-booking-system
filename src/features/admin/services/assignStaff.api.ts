import { api } from "@/utils/api/api.client";

interface AssignStaffPayload {
  staffId: string; // The user UUID of the doctor
}

interface AssignStaffResponse {
  message: string;
  data: any; // Returns the updated appointment entity
}

/**
 * Submits a PATCH request to link a staff member to an unassigned appointment slot.
 * Triggers backend validations to block same-day double-bookings.
 */
export async function assignStaffToAppointmentApi(
  bookingCode: string,
  staffId: string,
  token: string
): Promise<AssignStaffResponse> {
  const payload: AssignStaffPayload = { staffId };

  return await api<AssignStaffResponse>(
    `/api/vet/admin/appointment/${bookingCode}/assign`,
    {
      method: "PATCH",
      token,
      body: JSON.stringify(payload), // Encodes the data safely for your NestJS parser
    }
  );
}
