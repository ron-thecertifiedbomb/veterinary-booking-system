
import { api } from "@/utils/api/api.client";
import { StaffDropdownItem } from "../types/appointment";


/**
 * Loads filtered doctor selection options matching the appointment slot window constraints.
 * Returns an empty array if a doctor has already been pinned down.
 */
export async function getStaffOptionsForAppointment(bookingCode: string, token: string) {
  return await api<{ message: string; data: StaffDropdownItem[] }>(
    `/api/vet/admin/appointment/${bookingCode}/staff-options`,
    {
      method: "GET",
      token,
    }
  );
}
