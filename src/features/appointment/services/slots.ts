// src/features/appointment/services/slots.ts

import { SlotsApiResponse } from "@/features/appointment/types";
import { api } from "@/utils/api/api";

export async function fetchSlots(date: string, token: string) {
  return await api<SlotsApiResponse>(
    `/api/vet/appointments/slots?date=${date}`,
    {
      method: "GET",
      token,
    },
  );
}
