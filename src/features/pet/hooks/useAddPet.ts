// ..\src\features\pet\hooks\useAddPet.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { getStorageItem } from "@/features/auth/storage";
import { CreatePetPayload, CreatePetResponse } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export function useAddPet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const { updateUser, user } = useAuth();

  const addPet = async (
    payload: CreatePetPayload,
  ): Promise<CreatePetResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Not authenticated");
      }
      const response = await api<CreatePetResponse>("/api/vet/pets", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.message);
      await updateUser({
        pets: [...(user?.pets || []), response.data],
      });

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
