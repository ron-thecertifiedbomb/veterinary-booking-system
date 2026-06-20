import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useRef, useEffect } from "react";

import { getAppointmentsApi, GetAppointmentsFilters } from "../services/getAppointments.api";
import { Appointment } from "../types/appointment";

export interface FetchAppointmentsOptions {
  appointmentId?: string;
  bookingCode?: string;
  filters?: GetAppointmentsFilters;
  role?: string; // Explicit support for screen-level roles
}

const formatDateString = (dateInput: Date | number) => {
  const date = new Date(dateInput);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function useGetAppointments() {
  const { token, role: authRole } = useAuth(); 

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [singleAppointment, setSingleAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>(() => {
    const todayStr = formatDateString(Date.now());
    return {
      from: todayStr,
      to: todayStr,
      sortBy: "appointmentDate",
      sortOrder: "desc",
    };
  });

  // 1. CRITICAL CRUSH: Keep a mutable ref that ALWAYS points to the absolute latest filters state
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const fetchAppointments = useCallback(async (options?: FetchAppointmentsOptions) => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }

    const appointmentId = options?.appointmentId;
    const bookingCode = options?.bookingCode;
    
    // 2. DYNAMIC LOOKUP: Prioritize arguments passing, fallback to the freshly updated ref object
    const activeFilters = options?.filters !== undefined ? options.filters : filtersRef.current;
    const activeRole = options?.role !== undefined ? options.role : authRole;

    try {
      setLoading(true);
      setError(null);
      const isSingleLookup = !!appointmentId || !!bookingCode;

      const response = await getAppointmentsApi({
        token,
        filters: isSingleLookup ? undefined : activeFilters,
        appointmentId,
        role: activeRole, // Binds dynamic caller role permissions
        bookingCode,
      });
  
      if (response) {
        const resData = (response as any).data;
        const detailedItem = resData !== undefined ? resData : response;
  
        if (isSingleLookup) {
          setSingleAppointment(detailedItem as Appointment);
        } else {
          const appointmentList = Array.isArray(detailedItem) ? detailedItem : [];
          setAppointments(appointmentList as Appointment[]);
        }
      }
    } catch (err) {
      const parsedError = err instanceof Error ? err : new Error("Failed to fetch appointments");
      logger.error("Error fetching appointments:", parsedError);
      setError(parsedError);
    } finally {
      setLoading(false);
    }
  }, [token, authRole]); // Keeps callback signature stable, avoids infinite rendering chains

  return {
    appointments,
    singleAppointment,
    loading,
    error,
    filters,
    setFilters,
    fetchAppointments,
  };
}
