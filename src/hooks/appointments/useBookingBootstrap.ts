import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import { parseServerNow } from "@/utils/appointments/formatter";
import { logger } from "@/utils/logger/logger";
import { useCallback, useEffect, useRef } from "react";

export const useBookingBootstrap = (date: string) => {
  const { slots, fetchSlots, loading, error } = useGetSlots();

  const lastFetchedDate = useRef<string | null>(null);

  const refreshSlots = useCallback(async () => {
    try {
      logger.info("Bootstrap start", { date });
      await fetchSlots(date);
    } catch (err: any) {
      logger.error("Bootstrap failed", err);
    }
  }, [date, fetchSlots]);

  useEffect(() => {
    if (!date || date.trim() === "") return;
    if (lastFetchedDate.current === date) return;

    lastFetchedDate.current = date;
    refreshSlots();
  }, [date, refreshSlots]);

  const { today: formattedDate, time: formattedTime } = parseServerNow(null);

  return {
    slots,
    serverNow: null,
    formattedDate,
    formattedTime,
    loading,
    error,
    refreshSlots,
  };
};
