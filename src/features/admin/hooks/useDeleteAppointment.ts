// ..\src\features\appointment\hooks\useAssignStaff.ts

import { useState} from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { deleteAppointmentApi } from "../services/deleteAppointment.api";

export const useDeleteAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { token } = useAuth();

  const deleteAppointment = async (bookingCode: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      const response = await deleteAppointmentApi(bookingCode,  token);
      setMessage(response.message);
      return true; 
    } catch (err: any) {
      // Gracefully capture NestJS ConflictException messages
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete appointment";
      setError(errorMessage);
      logger.error("Failed to delete appointment", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteAppointment,
    loading,
    error,
    message,
 
  };
};
