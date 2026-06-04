import { CreatePetPayload, CreatePetResponse, GetPetsResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function getPetApi(token: string): Promise<GetPetsResponse> {
  return api<GetPetsResponse>("/api/vet/pets", {
    method: "GET",
    token,
  });
}
