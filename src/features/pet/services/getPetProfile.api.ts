import { GetOnePetResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function getPetProfileApi(petId?: string, token?: string): Promise<GetOnePetResponse> {
  return api<GetOnePetResponse>(`/api/vet/pets/${petId}`, {
    method: "GET",
    token,
  });
}