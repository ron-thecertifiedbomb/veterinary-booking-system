// ..\src\features\users\hook\useGetUserAppointemts.ts

import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";
import { Appointment, AppointmentHistoryItem } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";

export function useGetAppointments() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentHistoryItem[]>([]);
  
  // Dynamically extract the current date in YYYY-MM-DD format
  const todayStr = new Date().toISOString().split("T")[0];

  // Initialize filters with the dynamic current date
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  const fetchAppointments = useCallback(async () => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }
    
    try {
      setLoading(true);
      const response = await getAppointmentsApi(token, filters);
      
      if (response) {
        const fetchedAppointments = Array.isArray(response)
          ? response
          : (response as any).data || [];
        setAppointments(fetchedAppointments);
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
    } finally {
      setLoading(false);
    }
  }, [token, filters]);

  const isEmpty = appointments.length === 0;

  return {
    fetchAppointments,
    appointments,
    loading,
    isEmpty,
    filters,
    setFilters,
  };
}
