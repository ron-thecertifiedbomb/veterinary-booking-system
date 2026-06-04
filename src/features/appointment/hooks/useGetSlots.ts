// ..\src\features\appointment\hooks\useGetSlots.ts
import { getSlots } from "@/features/appointment/services/getSlots.api";
import { Slot } from "@/features/appointment/types/slots";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useGetSlots() {

  const { token } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const [fetchedSlot, setFetchedSlot] = useState<Slot[]>([]);
  const [date, setDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchSlots = async (selectedDate?: string) => {


    if (!selectedDate || !token) return null;
    try {
      setLoading(true);
      setError(null);
      const response = await getSlots(selectedDate, token);
      if (response) {
        setFetchedSlot(response.data.slots);
        setDate(response.data.meta.date);
        
      }
      return 
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

  const slots = fetchedSlot;
  const currentDate = date;

  return {
    slots,
    currentDate,
    loading,
    error,
    fetchSlots,
  };
}
