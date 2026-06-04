// ..\src\features\appointment\services\slots.ts

import { SlotsApiResponse } from "@/features/appointment/types/slots";
import { api } from "@/utils/api/api.client";

export async function getSlots(date: string, token: string) {
  return await api<SlotsApiResponse>(
    `/api/vet/appointments/slots?date=${date}`,
    {
      method: "GET",
      token,
    },
  );
}
