import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import { logger } from "@/utils/logger";
import { useCallback, useEffect, useRef } from "react";
import { parseServerNow } from "@/utils/dateandtime/serverTime";

export const useBookingBootstrap = (date: string) => {
  const { slots, getSlots, loading, error, serverNow, setSelectedTime } =
    useGetSlots();

  const lastFetchedDate = useRef<string | null>(null);

  const fetchSlots = useCallback(async () => {
    try {
      logger.info("Bootstrap start", { date });

      const res = await getSlots(date);
      if (!res) return;
    } catch (err: any) {
      logger.error("Bootstrap failed", err);
    }
  }, [date, getSlots]);

  useEffect(() => {
    if (!date || date.trim() === "") return;

    if (lastFetchedDate.current === date) return;

    lastFetchedDate.current = date;

    setSelectedTime(null);
    fetchSlots();
  }, [date, fetchSlots]);

  // ✅ ✅ ✅ ADD THIS
  const { formattedDate, formattedTime } = parseServerNow(serverNow);

  return {
    slots,
    serverNow,

    formattedDate, // ✅ NEW
    formattedTime, // ✅ NEW

    loading,
    error,
    refreshSlots: fetchSlots,
  };
};
``;
