import { Appointment } from "@/features/admin/types";
import { API } from "@/utils/config/api";
import { logger } from "@/utils/logger";



// ✅ GET ALL APPOINTMENTS
export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    logger.info("Fetching all appointments");
    const res = await fetch(`${API}/appointments`);
    if (!res.ok) {
      const err = await res.text();
      logger.error("Fetch failed", err);
      throw new Error("Failed to fetch appointments");
    }
    const data = await res.json();
    logger.info("Appointments fetched", data);
    return data;
  } catch (err) {
    logger.error("Error fetching appointments", err);
    throw err;
  }
};

// ✅ UPDATE STATUS (IMPORTANT FIX)
export const updateAppointmentStatus = async (
  id: number,
  status: Appointment["status"],
) => {
  const res = await fetch(`${API}/appointments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    throw new Error("Failed to update status");
  }

  return res.json();
};

