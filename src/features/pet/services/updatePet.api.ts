import { UpdatePetPayload, UpdatePetResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function updatePetApi(
  petId: string,
  payload: UpdatePetPayload,
  token: string,
): Promise<UpdatePetResponse> {
  return api<UpdatePetResponse>(`/api/vet/pets/${petId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}
