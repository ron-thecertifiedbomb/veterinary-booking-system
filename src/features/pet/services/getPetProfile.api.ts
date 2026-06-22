import { GetOnePetResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function getPetProfileApi(id?: string, token?: string): Promise<GetOnePetResponse> {
  return api<GetOnePetResponse>(`/api/vet/pets/${id}`, {
    method: "GET",
    token,
  });
}