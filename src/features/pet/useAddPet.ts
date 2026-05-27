import { useState } from "react";
import Toast from "react-native-toast-message";
import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { getStorageItem } from "@/features/auth/storage";

// ✅ types
type CreatePetPayload = {
  name: string;
  species: string;
  breed?: string;
  weight?: number;
};

type CreatePetResponse = {
  message: string;
  data: any;
};

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

      logger.info("Creating pet");

      // ✅ get token
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

      logger.info("Pet created", {
        id: response.data?.id,
      });

      // ✅ success toast
      Toast.show({
        type: "success",
        text1: response.message,
      });

      return response;
    } catch (err: any) {
      logger.error("Create pet failed", err);

      const errorMessage = err?.message || "Failed to create pet";
      setError(errorMessage);

      Toast.show({
        type: "error",
        text1: errorMessage,
      });

      return null;
    } finally {
      setLoading(false);
      logger.info("Create pet completed");
    }
  };

  return {
    addPet,
    loading,
    error,
    message,
  };
}
