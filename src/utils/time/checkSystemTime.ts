import { parse } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { logger } from "@/utils/logger";

export const checkSystemTime = (serverNow: string): boolean => {
  try {
    const parsedPH = parse(serverNow, "MMM d, yyyy, h:mm:ss a", new Date());

    const serverTime = fromZonedTime(parsedPH, "Asia/Manila");
    const clientPH = toZonedTime(new Date(), "Asia/Manila");

    const diffMinutes =
      Math.abs(serverTime.getTime() - clientPH.getTime()) / 60000;

    logger.info("System time check", {
      rawServer: serverNow,
      serverTime: serverTime.toString(),
      clientTime: clientPH.toString(),
      diffMinutes,
    });

    return diffMinutes > 5;
  } catch (err) {
    logger.error("Time check util failed", err);
    return false;
  }
};
