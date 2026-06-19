import { addAdminApi } from "@/features/admin/services/addAdmin.api";
import { AdminFormData, CreateAdminResponse } from "@/features/admin/types/admin.types";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useAddAdmin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { token, refreshSession } = useAuth(); 

  const addAdmin = async (
    payload: AdminFormData,
  ): Promise<CreateAdminResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (!token) {
        throw new Error("Not authenticated");
      }

      // ✅ create pet
      const response = await addAdminApi(payload, token);

      setMessage(response.message);

      // ✅ REFETCH USER (🔥 important change)
      await refreshSession();
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
    addAdmin,
    loading,
    error,
    message,
  };
}
