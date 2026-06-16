// ..\src\features\users\hook\useGetUserAppointemts.ts

import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";
import { Appointment, GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { todayStr } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";

export function useGetStaffAppointments() {

  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    from: todayStr,
    to: todayStr,
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  const fetchStaffAppointments = useCallback(async () => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await getAppointmentsApi(token, filters, undefined, user?.role);
      
      if (response) {
        const resData = (response as GetMyAppointmentHistoryResponse).data;
  setAppointments(resData)
        } 
      
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
    
    } finally {
      setLoading(false);
    }
  }, [token, filters]);
  

  const isEmpty = appointments.length === 0;

  return {
    fetchStaffAppointments,
    appointments,
    loading,
    isEmpty,
    filters,
    setFilters,
  };
}
