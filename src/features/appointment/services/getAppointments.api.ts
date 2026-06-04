// ..\src\features\appointment\services\slots.ts

import { AppointmentApiResponse } from "@/features/appointment/types/appointment";

import { api } from "@/utils/api/api.client";

export async function getAppointmentsApi(token: string) {
  return await api<AppointmentApiResponse>(`/api/vet/users`, {
    method: "GET",
    token,
  });
}
