// ..\src\features\users\hook\useGetUserAppointemts.ts

import { getAppointmentsApi } from "@/features/appointment/services/getAppointments.api";
import { Appointment } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useGetAppointments() {
    const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const fetchAppointments = async () => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const response = await getAppointmentsApi(token);
      if (response) {
        const fetchedAppointments = Array.isArray(response.data)
          ? response.data
          : [];
        setAppointments(fetchedAppointments);
        setMessage(response.message);
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      const errorMessage = err?.message;
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAppointments,
    appointments,
    loading,
    error,
    message,
  };
}
