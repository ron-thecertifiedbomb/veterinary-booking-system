import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { useState } from "react";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";
import Toast from "react-native-toast-message";

import {

  CreateAppointmentSlot,
} from "@/features/appointment/types";

type CreateAppointmentInput = {
  petName: string;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
};

export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createAppointment = async (
    input: CreateAppointmentInput,
  ): Promise<CreateAppointmentSlot> => {
    try {
      // ✅ prevent duplicate requests
      if (loading) {
        throw new Error("Request already in progress");
      }

      setLoading(true);
      setError(null);
      setSuccess(false);

      // ✅ get token
      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      // ✅ get user
      const storedUser = await getStorageItem("user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      const userId = user?.userId || user?.id;

      if (!userId) {
        throw new Error("Invalid user session");
      }

      const payload = {
        userId,
        petName: input.petName,
        serviceType: input.serviceType,
        date: input.date,
        time: input.time,
        notes: input.notes || "",
      };

      logger.info("Creating appointment payload ✅", payload);

      // ✅ API call
      const res = await api<CreateAppointmentSlot>("/api/vet/appointments", {
        method: "POST",
        body: JSON.stringify(payload),
        token,
      });

      const enrichedAppointment = {
        ...res.data,
        date: input.date,
        time: input.time,
      };

      const existing = await getStorageItem("appointments");
      const parsed = existing ? JSON.parse(existing) : [];

      const updated = [enrichedAppointment, ...parsed].slice(0, 20); // ✅ limit to 20

      await setStorageItem("appointments", JSON.stringify(updated));
      setSuccess(true);
      return res;
    } catch (err: any) {
      const message = err?.message || "Failed to create appointment";
      setError(message);
      throw err;
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
