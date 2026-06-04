// ..\src\features\pet\hooks\useGetPet.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Pet } from "@/features/pet/pet.types";
import { getPetApi } from "@/features/pet/services/getPetsApi";
import { useState } from "react";

export function useGetPets() {
  const { token } = useAuth();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPets = async (): Promise<Pet[] | null> => {
    try {
      setLoading(true);
      setMessage(null);

      if (!token) throw new Error("Not authenticated");

      const response = await getPetApi(token);

      const pets = Array.isArray(response.data) ? response.data : [];
      setPets(pets);
      setMessage(response.message);

      return pets;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch pets";
      setMessage(msg);
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