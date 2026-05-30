import { useState } from "react";
import Toast from "react-native-toast-message";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { getStorageItem } from "@/features/auth/storage";
import { CreatePetPayload, CreatePetResponse } from "@/features/pet/types";

// ✅ types




export function useAddPet() {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const addPet = async (
    payload: CreatePetPayload,
  ): Promise<CreatePetResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const token = await getStorageItem("access_token");
      if (!token) throw new Error("Not authenticated");

      // ✅ API call
      const response = await api<CreatePetResponse>("/api/vet/pets", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.message);
      return response;
    } catch (err: any) {


      const errorMessage = err?.message || "Failed to create pet";
      setError(errorMessage);

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
