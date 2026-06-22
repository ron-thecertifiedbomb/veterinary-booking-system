import { api } from "@/utils/api/api.client";

interface DeleteAppointmentResponse {
  message: string;
  bookingCode: string; 
}

export async function deleteAppointmentApi(
  bookingCode: string,
  token: string
): Promise<DeleteAppointmentResponse> {

  return await api<DeleteAppointmentResponse>(
    `/api/vet/admin/appointment/${bookingCode}/`,
    {
      method: "DELETE",
      token,
    }
  );
}
