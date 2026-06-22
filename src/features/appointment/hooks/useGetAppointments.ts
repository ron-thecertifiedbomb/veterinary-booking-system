// ..\src\features\appointment\hooks\useGetAppointments.ts
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback, useRef, useEffect } from "react";

// Points directly to your separated service file
import { Appointment } from "../types/appointment";
import { getAppointmentByBookingCodeApi, getAppointmentByIdApi, getAppointmentsApi, GetAppointmentsFilters } from "../services/getAppointments.api";

export interface FetchAppointmentsOptions {
  appointmentId?: string;
  bookingCode?: string;
  filters?: GetAppointmentsFilters; 
  role?: string;                     
}

export function useGetAppointments() {
  const { token, role: authRole } = useAuth(); 

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [singleAppointment, setSingleAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // ✅ NEW: Track if we have completed at least one network request
  const [hasFetched, setHasFetched] = useState(false);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

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
    
    const activeFilters = options?.filters !== undefined ? options.filters : filtersRef.current;
    const activeRole = options?.role !== undefined ? options.role : authRole;

    try {
      setLoading(true);
      setError(null);
      let response: any = null;

      if (appointmentId && appointmentId !== "null" && appointmentId !== "undefined") {
        response = await getAppointmentByIdApi({ token, appointmentId });
      } else if (bookingCode && bookingCode !== "null" && bookingCode !== "undefined") {
        response = await getAppointmentByBookingCodeApi({ token, bookingCode });
      } else {
        if (!activeRole || activeRole === "null" || activeRole === "undefined") {
          logger.warn("fetchAppointments listing called before user role metadata has mounted");
          return;
        }
        response = await getAppointmentsApi({ token, role: activeRole, filters: activeFilters });
      }
  
      if (response) {
        const resData = response?.data;
        const isSingleLookup = !!appointmentId || !!bookingCode;
  
        if (isSingleLookup) {
          const detailedItem = resData !== undefined ? resData : response;
          setSingleAppointment(detailedItem as Appointment);
        } else {
          let fetchedList: Appointment[] = [];
          
          if (Array.isArray(response)) {
            fetchedList = response;
          } else if (Array.isArray(resData)) {
            fetchedList = resData;
          } else if (resData?.data && Array.isArray(resData.data)) {
            fetchedList = resData.data;
          }
  
          setAppointments(fetchedList);
          setSingleAppointment(null); 
        }
      }
    } catch (err: any) {
      const parsedError = err instanceof Error ? err : new Error("Failed to fetch appointments data");
      logger.error("Fetching appointments failed", parsedError);
      setError(parsedError);
      
      if (!appointmentId && !bookingCode) {
        setAppointments([]);
      }

    } finally {
      setLoading(false);
      // ✅ Mark as fetched so the UI knows it's safe to evaluate isEmpty
      setHasFetched(true); 
    }
  }, [token, authRole]); 

  // ✅ UPDATED: Only return true if the array is empty AND we've actually checked the database
  const isEmpty = hasFetched && appointments.length === 0;

  return {
    fetchAppointments,
    appointments,
    singleAppointment,
    setSingleAppointment,
    loading,
    error,
    isEmpty,
    filters,
    setFilters,
  };
}