// ..\src\features\appointment\hooks\useAssignStaff.ts

import { useState } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { assignStaffToAppointmentApi } from "../services/assignStaff.api";


export const useAssignStaff = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { token } = useAuth();

  const assignStaff = async (bookingCode: string, staffId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      const response = await assignStaffToAppointmentApi(bookingCode, staffId, token);
      setMessage(response.message);
      return true; // Returns true on success to let the UI trigger data re-fetching
    } catch (err: any) {
      // Gracefully capture NestJS ConflictException messages (e.g., "Already scheduled")
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to assign staff member";
      setError(errorMessage);
      logger.error("Staff assignment failed", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    assignStaff,
    loading,
    error,
    message,
  };
};
