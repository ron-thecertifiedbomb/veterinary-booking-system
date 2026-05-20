import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!date) return;
    bootstrap();
  }, [date]);


const bootstrap = async () => {
  try {
    logger.info("Bootstrap start", { date });

    const res = await fetch(`${API}/appointments/slots?date=${date}`);
    const data = await res.json();

    logger.info("Bootstrap data received", data);

    setSlots(data.slots);

    const isMismatch = checkSystemTime(data.now);

    logger.info("Time check result", {
      isMismatch,
      pathname,
    });

    if (isMismatch && pathname !== "/invalid-time") {
      logger.warn("Redirecting to invalid-time");

      router.replace("/invalid-time");
      return;
    }
  } catch (err) {
    logger.error("Bootstrap failed", err);
  } finally {
    logger.info("Bootstrap finished");
    setLoading(false);
  }
};

  return {
    slots,
    loading,
  };
};
``;
