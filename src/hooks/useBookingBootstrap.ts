import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "expo-router";

import { API } from "@/utils/config/api";
import { checkSystemTime } from "@/utils/time/checkSystemTime";
import { Slot } from "@/features/booking/types";
import { logger } from "@/utils/logger";

export const useBookingBootstrap = (date: string) => {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  const fetchSlots = useCallback(async () => {
    try {
      setLoading(true);

      logger.info("Bootstrap start", { date });

      const res = await fetch(`${API}/appointments/slots?date=${date}`);

      if (!res.ok) {
        const errorBody = await res.text();

        logger.error("Bootstrap fetch failed", {
          status: res.status,
          body: errorBody,
        });

        throw new Error("Failed to fetch slots");
      }

      const data = await res.json();

      logger.info("Bootstrap data received", data);

      setSlots(Array.isArray(data.slots) ? data.slots : []);

      const isMismatch = checkSystemTime(data.now);

      if (isMismatch && pathname !== "/invalid-time") {
        router.replace("/invalid-time");
        return;
      }
    } catch (err) {
      logger.error("Bootstrap failed", err);
    } finally {
      setLoading(false);
    }
  }, [date, pathname, router]);

  useEffect(() => {
    if (!date) return;
    fetchSlots();
  }, [date, fetchSlots]);

  return {
    slots,
    loading,
    refreshSlots: fetchSlots,
  };
};
