// ..\src\features\appointment\hooks\useCreateAppointment.ts

import {
  getStorageItem,
  setStorageItem,
} from "@/features/auth/storage/auth.storage";
import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { CreateAppointmentPayload, CreateAppointmentResponse } from "@/features/appointment/types/appointment";
import { createAppointmentApi } from "@/features/appointment/services/createAppointment.api";

export const useCreateAppointment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 const [message, setMessage] = useState<string | null>(null);
  const { token } = useAuth();

  const createAppointment = async (
    input: CreateAppointmentPayload,
  ): Promise<CreateAppointmentResponse | null> => {
    try {
      setLoading(true);
      setError(null);
 
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }
      const payload = {
        petId: input.petId,
        serviceType: input.serviceType.toUpperCase(),
        appointmentDate: input.appointmentDate,
        notes: input.notes || "",

      };
      const response = await createAppointmentApi(payload, token);
       setMessage(response.message);
      return response;
    } catch (err: any) {
      const message =
        err?.message ||
        (typeof err?.data === "object" && err?.data?.message) ||
        "Failed to create appointment";
      setError(message);
      logger.error("Create appointment failed", message);

      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };


  return {
    createAppointment,
    loading,
    error,
    message,

  };
};
;
