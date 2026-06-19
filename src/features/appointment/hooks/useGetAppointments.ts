// ..\src\features\appointment\hooks\useGetAppointments.ts
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";
import { Appointment } from "../types/appointment";
import { getAppointmentsApi, GetAppointmentsFilters } from "../services/getAppointments.api";


export interface FetchAppointmentsOptions {
  appointmentId?: string;
  bookingCode?: string;
}

export function useGetAppointments() {
  const { token, role } = useAuth(); 

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [singleAppointment, setSingleAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  const fetchAppointments = useCallback(async (options?: FetchAppointmentsOptions) => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }

    const appointmentId = options?.appointmentId;
    const bookingCode = options?.bookingCode;

    try {
      setLoading(true);
      const isSingleLookup = !!appointmentId || !!bookingCode;

      // 1. Forward parameters inside a clean structured options object configuration payload
      const response = await getAppointmentsApi({
        token,
        // Bypass global list filter params during single lookups
        filters: isSingleLookup ? undefined : filters,
        appointmentId,
        role,
        bookingCode,
      });
  
      if (response) {
        const resData = (response as any).data;
  
        if (isSingleLookup) {
          // If response is already the wrapped format { message, data }, use data. Else fallback to response
          const detailedItem = resData !== undefined ? resData : response;
          setSingleAppointment(detailedItem as Appointment);
        } else {
          let fetchedList: Appointment[] = [];
          
          // Fallback handlers to securely extract arrays from direct or wrapped data packets
          if (Array.isArray(response)) {
            fetchedList = response;
          } else if (Array.isArray(resData)) {
            fetchedList = resData;
          } else if (resData?.data && Array.isArray(resData.data)) {
            fetchedList = resData.data;
          }
  
          setAppointments(fetchedList);
          setSingleAppointment(null); // Clear singular trackers upon list changes
        }
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      if (!appointmentId && !bookingCode) {
        setAppointments([]);
      }
    } finally {
      setLoading(false);
    }
  }, [token, role, filters]); 

  const isEmpty = appointments.length === 0;

  return {
    fetchAppointments,
    appointments,
    singleAppointment,
    setSingleAppointment,
    loading,
    isEmpty,
    filters,
    setFilters,
  };
}
