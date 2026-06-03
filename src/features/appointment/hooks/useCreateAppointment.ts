import { getStorageItem, setStorageItem } from "@/features/auth/storage";
import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

import {
  CreateAppointmentInput,
  CreateAppointmentResponse,
} from "@/features/appointment/types";

import { useAuth } from "@/features/auth/providers/AuthProvider";

export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { token } = useAuth(); // ✅ keep it clean

  const createAppointment = async (
    input: CreateAppointmentInput,
  ): Promise<CreateAppointmentResponse> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // ✅ TOKEN
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      // ✅ USER (safe parse)
      const storedUser = await getStorageItem("user");

      let parsedUser = null;
      try {
        parsedUser = storedUser ? JSON.parse(storedUser) : null;
      } catch {
        throw new Error("Corrupted user session");
      }

      const userId = parsedUser?.id;
      if (!userId) throw new Error("Invalid user session");

   
      const payload = {
     
        petId: input.petId,
        serviceType: input.serviceType.toUpperCase(),
        appointmentDate: input.appointmentDate,
        notes: input.notes || "",
      };

      // ✅ API CALL
      const res = await api<CreateAppointmentResponse>(
        "/api/vet/appointments",
        {
          method: "POST",
          body: JSON.stringify(payload),
          token,
        },
      );

      const appointment = {
        ...res.data,
      };

      // ✅ STORAGE
      const existing = await getStorageItem("appointments");

      let parsed: any[] = [];
      try {
        parsed = existing ? JSON.parse(existing) : [];
      } catch {
        parsed = [];
      }

      const updated = [appointment, ...parsed].slice(0, 20);

      await setStorageItem("appointments", JSON.stringify(updated));

      setSuccess(true);

      return {
        message: res.message,
        data: res.data,
      };
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create appointment";

      setError(message);
      logger.error("Create appointment failed", message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const resetSuccess = () => setSuccess(false);

  return {
    createAppointment,
    loading,
    error,
    success,
    resetSuccess,
  };
};
``;
