// ..\src\features\users\hook\useGetUserAppointemts.ts

import { getAppointmentsApi } from "@/features/appointment/services/getAppointments.api";
import { Appointment } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useGetAppointments() {

    const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {

    if (!token) {
      throw new Error("Not authenticated");
    }
    try {
      setLoading(true);
      const response = await getAppointmentsApi(token);
      if (response) {
        const fetchedAppointments = Array.isArray(response.data)
          ? response.data
          : [];
        setAppointments(fetchedAppointments);
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

const isEmpty = appointments.length === 0


  return {
    fetchAppointments,
    appointments,
    loading,
    isEmpty

  };
}
