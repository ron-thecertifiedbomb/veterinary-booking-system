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
  filters?: GetAppointmentsFilters; // Added explicit support for screen overrides
  role?: string;                     // Added explicit support for screen roles
}

export function useGetAppointments() {
  const { token, role: authRole } = useAuth(); 

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [singleAppointment, setSingleAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  // Keep an active mutable reference of the filters to prevent infinite re-render loop cycles
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
    
    // Fallback prioritizations: explicit screen parameter -> latest hook ref state closure
    const activeFilters = options?.filters !== undefined ? options.filters : filtersRef.current;
    const activeRole = options?.role !== undefined ? options.role : authRole;

    try {
      setLoading(true);
      setError(null);
      let response: any = null;

      // 1. Route directly to your distinct separated individual endpoints
      if (appointmentId && appointmentId !== "null" && appointmentId !== "undefined") {
        response = await getAppointmentByIdApi({ token, appointmentId });
      } else if (bookingCode && bookingCode !== "null" && bookingCode !== "undefined") {
        response = await getAppointmentByBookingCodeApi({ token, bookingCode });
      } else {
        // Broad lists collection fetches require validation checks on the role payload strings
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
          
          // Unpack array data variations safely
          if (Array.isArray(response)) {
            fetchedList = response;
          } else if (Array.isArray(resData)) {
            fetchedList = resData;
          } else if (resData?.data && Array.isArray(resData.data)) {
            fetchedList = resData.data;
          }
  
          setAppointments(fetchedList);
          setSingleAppointment(null); // Clear lookup trackers safely upon navigating to lists
        }
      }
    } catch (err: any) {
      const parsedError = err instanceof Error ? err : new Error("Failed to fetch appointments data");
      logger.error("Fetching appointments failed", parsedError);
      setError(parsedError);
      
      // Wipe broad collections arrays securely upon execution failures
      if (!appointmentId && !bookingCode) {
        setAppointments([]);
      }
    } finally {
      setLoading(false);
    }
  }, [token, authRole]); // Keeps function identity stable to break infinite effect loops

  const isEmpty = appointments.length === 0;

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
