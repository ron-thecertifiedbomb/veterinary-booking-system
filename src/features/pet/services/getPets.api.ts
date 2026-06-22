import { GetAllPetsResponse, GetOnePetResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";

export async function getPetsApi(token: string): Promise<GetOnePetResponse> {
  return api<GetOnePetResponse>("/api/vet/pets", {
    method: "GET",
    token,
  });
}
