// ..\src\features\users\hook\useGetUserAppointemts.ts

import {
  AppointmentData,
  CreateAppointmentResponse,
} from "@/features/appointment/types";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";
import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useGetUserAppointments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<AppointmentData[]>([]);

  const fetchAppointments = async (): Promise<AppointmentData[] | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const stored = await getStorageItem("appointments");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAppointments(parsed);
          logger.info("Loaded appointments from cache ✅");
        }
      }

      // ✅ 2. get token
      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }

      // ✅ 3. FETCH FROM API
      const response = await api<CreateAppointmentResponse>(
        "/api/vet/users/appointments",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const safeData = Array.isArray(response.data) ? response.data : [];

      setAppointments(safeData);
      setMessage(response.message);

      await setStorageItem("appointments", JSON.stringify(safeData));

      return safeData;
    } catch (err: any) {
      logger.error("Fetching appointments failed", err);
      const errorMessage = err?.message || "Failed to fetch user appointments";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAppointments,
    appointments,
    loading,
    error,
    message,
  };
}
