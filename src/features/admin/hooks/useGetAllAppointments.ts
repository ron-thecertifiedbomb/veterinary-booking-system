import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useEffect } from "react";
import { Appointment, GetAllAppointmentsResponse } from "../types/admin.types";

export interface UseGetAllAppointmentsProps {
  initialFilters?: Partial<GetAppointmentsFilters>;
  role?: string; 
}

export function useGetAllAppointments({ initialFilters, role: customRole }: UseGetAllAppointmentsProps = {}) {
  const { token, user } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>(() => ({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
    ...initialFilters,
  }));

  useEffect(() => {
    if (initialFilters) {
      setFilters((prev) => ({ ...prev, ...initialFilters }));
    }
  }, [initialFilters]);

  const activeRole = customRole ?? user?.role;

  const fetchAllAppointments = useCallback(async () => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Explicit parameters mapping filters, undefined placeholder, and the resolved active role context
      const response = await getAppointmentsApi(token, filters, undefined, activeRole);
      
      // Type assertion mapping based on GetAllAppointmentsResponse payload structure
      const resData = (response as GetAllAppointmentsResponse)?.data?.appointments;
      
      if (Array.isArray(resData)) {
        setAppointments(resData);
      } else {
        setAppointments([]); 
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch appointments"));
      setAppointments([]); 
    } finally {
      setLoading(false);
    }
  }, [token, filters, activeRole]);

  useEffect(() => {
    fetchAllAppointments();
  }, [fetchAllAppointments]);

  const isEmpty = appointments.length === 0;
  const hasAppointments = appointments.length > 0; 

  return {
    fetchAllAppointments,
    appointments,
    loading,
    error,
    isEmpty,
    hasAppointments, 
    filters,
    setFilters,
  };
}
