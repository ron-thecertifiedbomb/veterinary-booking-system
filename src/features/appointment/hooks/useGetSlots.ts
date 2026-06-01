// useGetSlots.ts

import { fetchSlots } from "@/features/appointment/services/slots";
import { SlotsResponse } from "@/features/appointment/types";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";


export function useGetSlots(date: string) {

  const { token } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [slotsData, setSlotsData] = useState<SlotsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getSlots = async (selectedDate?: string) => {
    const targetDate = selectedDate || date;
    if (!targetDate || !token) return null;
    try {
      setLoading(true);
      setError(null);
      const response = await fetchSlots(targetDate, token);
      if (response?.data) {
        setSlotsData(response.data);
      }
      return response?.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to fetch slots";
      setError(msg);
      logger.error("Failed to fetch slots", msg);

      return null;
    } finally {
      setLoading(false);
    }
  };
  return {
    slotsData,
    loading,
    error,
    getSlots,
  };
}
