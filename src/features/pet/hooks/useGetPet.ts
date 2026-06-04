// ..\src\features\pet\hooks\useGetPet.ts

import {
  getStorageItem,
  setStorageItem,
} from "@/features/auth/storage/auth.storage";
import { GetPetsResponse, Pet } from "@/features/pet/pet.types";
import { api } from "@/utils/api/api.client";
import { useState } from "react";

export function useGetPets() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPets = async (): Promise<Pet[] | null> => {
    try {
      setLoading(true);
      setMessage(null);

      const stored = await getStorageItem("pets");

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setPets(parsed);
        }
      }
      const token = await getStorageItem("access_token");
      if (!token) throw new Error("Not authenticated");

      const response = await api<GetPetsResponse>("/api/vet/pets", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const safeData = Array.isArray(response.data) ? response.data : [];
      setPets(safeData);
      setMessage(response.message);

      await setStorageItem("pets", JSON.stringify(safeData));

      return safeData;
    } catch (err: any) {
      err?.message || "Failed to fetch pets";
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    pets,
    fetchPets,
    loading,
    message,
  };
}
