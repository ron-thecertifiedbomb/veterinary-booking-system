import { useAuth } from "@/features/auth/providers/AuthProvider";
import { UpdatePetPayload, UpdatePetResponse } from "@/features/pet/pet.types";
import { updatePetApi } from "@/features/pet/services/updatePet.api";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useUpdatePet() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updatePet = async (
    petId: string,
    payload: UpdatePetPayload,
  ): Promise<UpdatePetResponse | null> => {
    try {
      setLoading(true);
      setError(null);

      if (!token) throw new Error("Not authenticated");

      const response = await updatePetApi(petId, payload, token);
      return response;
    } catch (err: any) {
      const message = err?.message || "Failed to update pet";
      setError(message);
      logger.error("Update pet failed", message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return { updatePet, loading, error };
}
