import { useState } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { getStaffOptionsForAppointment } from "../services/getStaffOptions.api";
import { StaffDropdownItem } from "../types/appointment";


export const useStaffOptions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [options, setOptions] = useState<StaffDropdownItem[]>([]);
  const { token } = useAuth();

  /**
   * Fetches available doctors for a specific appointment booking code.
   * Automatically handles auth tokens and filters busy staff.
   */
  const fetchStaffOptions = async (bookingCode: string): Promise<StaffDropdownItem[] | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      const response = await getStaffOptionsForAppointment(bookingCode, token);
      
      setMessage(response.message);
      setOptions(response.data);
      logger.info('response', response)
      return response.data;
    } catch (err: any) {
      // Clean fallback text for NestJS Exception payloads
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch staff options";
      
      setError(errorMessage);
      logger.error("Fetch staff options failed", errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resets the local hook cache state back to default structures.
   */
  const resetOptions = () => {
    setOptions([]);
    setError(null);
    setMessage(null);
  };

  return {
    fetchStaffOptions,
    resetOptions,
    options, // The clean array used directly by select dropdown components
    loading,
    error,
    message,
  };
};
