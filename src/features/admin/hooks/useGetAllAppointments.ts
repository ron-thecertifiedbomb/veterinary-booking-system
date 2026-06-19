// ..\src\features\admin\hooks\useGetAllAppointments.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useEffect } from "react";
import { Appointment } from "@/features/appointment/types/appointment";
import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";

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
      logger.warn("fetchAllAppointments called without an authentication token");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // FIX: Cleaned out single resource tracking parameters
      const response = await getAppointmentsApi({
        token,
        filters,
        role: activeRole,
      });
      
      const resData = (response as any).data;
      let fetchedList: Appointment[] = [];

      // FIX: Safe array extraction handlers matching your updated backend mapping models
      if (Array.isArray(response)) {
        fetchedList = response;
      } else if (Array.isArray(resData)) {
        fetchedList = resData;
      } else if (resData?.data && Array.isArray(resData.data)) {
        fetchedList = resData.data;
      } else if (resData?.appointments && Array.isArray(resData.appointments)) {
        fetchedList = resData.appointments;
      }
      
      setAppointments(fetchedList);
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
