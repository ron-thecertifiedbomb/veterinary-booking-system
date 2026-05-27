import { useState } from "react";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { parseServerNow } from "@/utils/dateandtime/serverTime";

type Slot = {
  time: string;
  available: boolean;
};

type SlotsResponse = {
  now: string;
  slots: Slot[];
};

export function useGetSlots() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [serverNow, setServerNow] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getSlots = async (date: string) => {
    try {
      setLoading(true);
      setError(null);

      logger.info("Fetching slots", { date });

      const res = await api<SlotsResponse>(
        `/api/vet/appointments/slots?date=${date}`,
      );

      setSlots(Array.isArray(res.slots) ? res.slots : []);
      setServerNow(res.now);

      logger.info("Slots fetched", res);

      return res;
    } catch (err: any) {
      const message = err?.message || "Failed to load slots";

      setError(message);
      logger.error("Slots fetch failed", err);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ ✅ CLEAN: single object
  const now = parseServerNow(serverNow);

  return {
    getSlots,
    slots,

    now, // ✅ one clean object (date + time)

    selectedTime,
    setSelectedTime,
    loading,
    error,
  };
}
