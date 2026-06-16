// ..\src\features\users\hook\useGetUserAppointemts.ts

import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";
import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useEffect } from "react";

export function useGetAllAppointments() {
  const { token, user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  const fetchAllAppointments = useCallback(async () => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Removed the dangling comma and safely passed undefined for ID so role hits the 4th parameter
      const response = await getAppointmentsApi(token, filters, undefined, user?.role);
      const resData = (response as GetMyAppointmentHistoryResponse)?.data;
      
      if (Array.isArray(resData)) {
        setAppointments(resData);
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch appointments"));
    } finally {
      setLoading(false);
    }
  }, [token, filters, user?.role]);

  // Automatically fetch data whenever filters or the authentication token changes
  useEffect(() => {
    fetchAllAppointments();
  }, [fetchAllAppointments]);

  const isEmpty = appointments.length === 0;

  return {
    fetchAllAppointments,
    appointments,
    loading,
    error,
    isEmpty,
    filters,
    setFilters,
  };
}
