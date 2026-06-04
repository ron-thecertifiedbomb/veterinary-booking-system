import { useAuth } from "@/features/auth/providers/AuthProvider";
import { CreatePetPayload, CreatePetResponse } from "@/features/pet/pet.types";
import { createPetApi } from "@/features/pet/services/createPetApi";

import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useAddPet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { token, refreshSession } = useAuth(); // ✅ use this

  const addPet = async (
    payload: CreatePetPayload,
  ): Promise<CreatePetResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (!token) {
        throw new Error("Not authenticated");
      }

      // ✅ create pet
      const response = await createPetApi(payload, token);

      setMessage(response.message);

      // ✅ REFETCH USER (🔥 important change)
      await refreshSession();

      return response;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create pet";

      setError(errorMessage);
      logger.error("Add pet failed", err);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addPet,
    loading,
    error,
    message,
  };
}
