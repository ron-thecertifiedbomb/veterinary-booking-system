// ..\src\features\users\hook\useGetUserAppointemts.ts

import { Appointment } from "@/features/admin/types/admin.types";
import { getAppointmentsApi, GetAppointmentsFilters } from "@/features/appointment/services/getAppointments.api";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";


export function useGetAppointments() {
  const { token } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [singleAppointment, setSingleAppointment] = useState<Appointment | null>(null); // State for holding a single fetched record
  const [loading, setLoading] = useState(false);
  
  const [filters, setFilters] = useState<GetAppointmentsFilters>({
    sortBy: "appointmentDate",
    sortOrder: "desc",
  });

  /**
   * Fetches either a specific appointment by ID or a list of appointments based on current filters.
   */
  const fetchAppointments = useCallback(async (appointmentId?: string) => {
    if (!token) {
      logger.warn("fetchAppointments called without an authentication token");
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await getAppointmentsApi(token, filters, appointmentId);
      
      if (response) {
        // Cast response to any safely to extract nestjs envelope fields
        const resData = (response as any).data;
  
        if (appointmentId) {
          // Single Appointment Mode: use response.data if it exists, otherwise fallback to root object
          const detailedItem = resData || response;
          setSingleAppointment(detailedItem as Appointment);
        } else {
          // List Mode: extract response.data array, or fallback if raw array returned
          let fetchedList: Appointment[] = [];
          
          if (Array.isArray(resData)) {
            fetchedList = resData;
          } else if (Array.isArray(response)) {
            fetchedList = response;
          } else if (resData?.data && Array.isArray(resData.data)) {
            // Extra safety check in case of deep nested paging structures
            fetchedList = resData.data;
          }
  
          setAppointments(fetchedList);
          setSingleAppointment(null); // Clear single tracker upon fetching lists
        }
      }
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      // Safe failure fallbacks to keep UI components from crashing
      if (!appointmentId) {
        setAppointments([]);
      }
    } finally {
      setLoading(false);
    }
  }, [token, filters]);
  

  const isEmpty = appointments.length === 0;

  return {
    fetchAppointments,
    appointments,
    singleAppointment, // Exposed to your component layers
    setSingleAppointment,
    loading,
    isEmpty,
    filters,
    setFilters,
  };
}
