import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState, useCallback } from "react";
import { getPatientsApi } from "../services/getPatients.api";
import {  AssignedPatient, AssignedPatientsResponse } from "../types/staff.types";

export function useGetPatient() {
  const { token } = useAuth();
  // Changed to an array type since API endpoints usually return a collection of assigned patients
  const [patients, setPatients] = useState<AssignedPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPatient = useCallback(async () => {
    if (!token) {
      logger.warn("fetchPatient called without an authentication token");
      return;
    }
    
    try {
      setLoading(true);
      setErrorMsg(null); // Clear previous errors on a new execution try

      const response = await getPatientsApi(token);
      
      if (response) {
        // Enforce safe type casing from your explicit AssignedPatientsResponse contract
        const resData = (response as AssignedPatientsResponse)?.data;
        
        if (Array.isArray(resData)) {
          setPatients(resData);
        } else if (resData) {
          // If the payload turns out to be a singular object profile envelope, treat it as an array
          setPatients([resData as unknown as AssignedPatient]);
        } else {
          setPatients([]);
        }
      }
    } catch (err: any) {
      logger.error("Fetching assigned patients failed", err);
      // Safely check nested response schemas or fall back to standard error strings
      const extractedMessage = err?.response?.data?.message || err?.message || "Failed to fetch patients";
      setErrorMsg(extractedMessage);
      setPatients([]); // Protect memory components from corrupt states
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Clean boolean interfaces for the tracking layouts
  const isEmpty = patients.length === 0;
  const hasPatients = patients.length > 0;

  return {
    fetchPatient,
    patients,
    loading,
    errorMsg,
    isEmpty,
    hasPatients,
  };
}
