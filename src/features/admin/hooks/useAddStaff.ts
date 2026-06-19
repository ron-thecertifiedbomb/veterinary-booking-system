import { addStaffApi } from "@/features/admin/services/addStaffApi";
import {
  CreateStaffResponse,
  StaffFormData
} from "@/features/admin/types/admin.types";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useAddStaff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const {user, token, refreshSession } = useAuth();

  const addStaff = async (
    payload: StaffFormData,
  ): Promise<CreateStaffResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (!token) {
        throw new Error("Not authenticated");
      }
logger.info('user', user?.role)
      // ✅ create pet
      const response = await addStaffApi(payload, token);

      setMessage(response.message);

      // ✅ REFETCH USER (🔥 important change)
      
      return response;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create admin";
      setError(errorMessage);
      logger.error("Add admin failed", err);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addStaff,
    loading,
    error,
    message,
  };
}
