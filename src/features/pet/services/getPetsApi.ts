import { GetAllPetsResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function getPetApi(token: string): Promise<GetAllPetsResponse> {
  return api<GetAllPetsResponse>("/api/vet/pets", {
    method: "GET",
    token,
  });
}
