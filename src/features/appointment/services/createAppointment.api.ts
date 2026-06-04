import { CreateAppointmentPayload, CreateAppointmentResponse } from "@/features/appointment/types/appointment";
import { api } from "@/utils/api/api.client";

export async function createAppointmentApi(
  payload: CreateAppointmentPayload,
  token: string,
): Promise<CreateAppointmentResponse> {
  return api<CreateAppointmentResponse>("/api/vet/appointments", {
    method: "POST",
    token, 
    body: JSON.stringify(payload),
  });
}
