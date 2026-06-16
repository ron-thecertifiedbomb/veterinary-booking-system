// ..\src\features\appointment\services\slots.ts

import { GetMyAppointmentHistoryResponse } from "@/features/appointment/types/appointment";
import { api } from "@/utils/api/api.client";


export async function getAppointmentsApi(
  token: string, 

) {

  const queryParam: string | null =  null 
  return await api<GetMyAppointmentHistoryResponse>(`/api/vet/users/appointments${queryParam}`, {
    method: "GET",
    token,
  });
}
