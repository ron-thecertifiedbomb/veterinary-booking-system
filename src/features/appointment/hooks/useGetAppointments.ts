// ..\src\features\users\hook\useGetUserAppointemts.ts
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

      // FIX: Map options down into your exact positional function arguments
      const response = await getAppointmentsApi(
        token,
        filters,
        appointmentId,
        role,
        bookingCode
      );
  
      if (response) {
        const resData = (response as any).data;
  
        if (isSingleLookup) {
          const detailedItem = resData !== undefined ? resData : response;
          setSingleAppointment(detailedItem as Appointment);
        } else {
          let fetchedList: Appointment[] = [];
          if (Array.isArray(resData)) {
            fetchedList = resData;
          } else if (Array.isArray(response)) {
            fetchedList = response;
          } else if (resData?.data && Array.isArray(resData.data)) {
            fetchedList = resData.data;
          } else if ((response as any).appointments && Array.isArray((response as any).appointments)) {
            fetchedList = (response as any).appointments;
          }
  
          setAppointments(fetchedList);
          setSingleAppointment(null);
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
