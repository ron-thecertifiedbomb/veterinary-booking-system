// ..\src\features\admin\api.ts

import { Appointment } from "@/features/admin/types";
import { API } from "@/utils/api/api.config";

import { logger } from "@/utils/logger/logger";

export const getAppointments = async (): Promise<Appointment[]> => {
  try {

    const response = await fetch(`${API}/appointments`);
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    const data = await response.json();
    return data;
  } catch (err) {
    logger.error("Error fetching appointments", err);
    throw err;
  }
};

export const updateAppointmentStatus = async (
  id: number,
  status: Appointment["status"],
) => {
  try {

    const response = await fetch(`${API}/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
 
      throw new Error("Failed to update status");
    }

    const data = await response.json();

    logger.info("Appointment status updated", data);

    return data;
  } catch (err) {
    logger.error("Error updating appointment status", {
      id,
      status,
      error: err,
    });

    throw err;
  }
};

export { Appointment };
