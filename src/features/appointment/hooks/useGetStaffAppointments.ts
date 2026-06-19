// ..\src\features\users\hook\useGetUserAppointemts.ts

import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";
import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";

export interface FetchAppointmentsOptions {
  appointmentId?: string;
  bookingCode?: string;
}

export function useGetStaffAppointments() {
  const { token, role } = useAuth(); // Merged token and role into one declaration
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [singleAppointment, setSingleAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  // Added options parameter to the callback function signature
  const fetchStaffAppointments = useCallback(async (options?: FetchAppointmentsOptions) => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }
    
    const appointmentId = options?.appointmentId;
    const bookingCode = options?.bookingCode;
    
    try {
      setLoading(true);
      const isSingleLookup = !!appointmentId || !!bookingCode;
      
      const response = await getAppointmentsApi({
        token,
        filters: isSingleLookup ? undefined : filters,
        appointmentId,
        role,
        bookingCode,
      });
      
      if (response) {
        const resData = (response as GetMyAppointmentHistoryResponse).data;
        
        // Correctly handling both list and single item storage
        if (isSingleLookup && resData.length > 0) {
          setSingleAppointment(resData[0]);
        } else {
          setAppointments(resData);
        }
      } 
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
    } finally {
      setLoading(false);
    }
  }, [token, filters, role]); // Added role to the dependency array

  const isEmpty = appointments.length === 0;

  return {
    fetchStaffAppointments,
    appointments,
    singleAppointment, // Exposed singleAppointment state
    loading,
    isEmpty,
    filters,
    setFilters,
  };
}
