import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { parseServerNow } from "@/utils/dateandtime/serverTime";

type Slot = {
  time: string;
  available: boolean;
};

type SlotsResponse = {
  now: string;
  slots: Slot[];
};

export function useGetSlots(date: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [serverNow, setServerNow] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const getSlots = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api<SlotsResponse>(
        `/api/vet/appointments/slots?date=${date}`,
      );

      setSlots(Array.isArray(res.slots) ? res.slots : []);
      setServerNow(res.now);

      return res;
    } catch (err: any) {
      // ✅ Always use server message first
      const message =
        err?.response?.message || err?.message || "Failed to fetch slots";

      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date) {
      getSlots();
    }
  }, [date]);

  // ✅ Safe parsing (avoid null crash)
  const parsed = serverNow ? parseServerNow(serverNow) : null;

  return {
    slots,
    today: parsed?.today ?? null,
    time: parsed?.time ?? null,
    loading,
    error,
    selectedTime,
    setSelectedTime,

    // ✅ expose for manual refresh
    refetch: getSlots,
  };
}
