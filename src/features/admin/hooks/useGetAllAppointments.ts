// ..\src\features\admin\hooks\useGetAllAppointments.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useEffect, useRef } from "react";
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
  
  // Explicitly defined target date string for Philippines (June 20, 2026)
  const fallbackToday = "2026-06-20";

  const [filters, setFilters] = useState<GetAppointmentsFilters>(() => ({
    from: fallbackToday, // Overridden from todayStr
    to: fallbackToday,   // Overridden from todayStr
    sortBy: "appointmentDate",
    sortOrder: "desc",
    ...initialFilters,
  }));

  // FIX 1: Use a ref to track initialFilters to prevent infinite re-render loops from object reference shifts
  const initialFiltersRef = useRef(initialFilters);
  useEffect(() => {
    initialFiltersRef.current = initialFilters;
  }, [initialFilters]);

  // Sync external filters safely only if value properties actually change
  useEffect(() => {
    if (initialFiltersRef.current) {
      setFilters((prev) => {
        // Deep string comparison to bypass shallow reference mismatches
        if (JSON.stringify(prev) === JSON.stringify({ ...prev, ...initialFiltersRef.current })) {
          return prev;
        }
        return { ...prev, ...initialFiltersRef.current };
      });
    }
  }, [initialFilters]);

  const activeRole = customRole ?? user?.role;

  // FIX 2: Stabilize function by separating API arguments inside the execution loop
  const fetchAllAppointments = useCallback(async () => {
    if (!token) {
      logger.warn("fetchAllAppointments called without an authentication token");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getAppointmentsApi({
        token,
        filters, // Stays in dependencies safely now
        role: activeRole,
      });
      
      const resData = (response as any).data;
      let fetchedList: Appointment[] = [];

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

  // FIX 3: Trigger calls specifically based on reactive state parameters, not function bindings
  useEffect(() => {
    if (token) {
      fetchAllAppointments();
    }
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
