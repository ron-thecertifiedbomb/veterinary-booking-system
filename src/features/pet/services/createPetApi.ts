import { CreatePetPayload, CreatePetResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function createPetApi(
  payload: CreatePetPayload,
  token: string,
): Promise<CreatePetResponse> {
  return api<CreatePetResponse>("/api/vet/pets", {
    method: "POST",
    token, 
    body: JSON.stringify(payload),
  });
}
