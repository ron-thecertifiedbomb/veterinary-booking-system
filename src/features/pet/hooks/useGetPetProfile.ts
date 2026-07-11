import { useAuth } from "@/features/auth/providers/AuthProvider";
import { PetProfile } from "@/features/pet/pet.types";
import { getPetProfileApi } from "@/features/pet/services/getPetProfile.api";
import { useState } from "react";

export function useGetPetProfile() {
  const { token } = useAuth();
  const [pet, setPet] = useState<PetProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPet = async (id: string): Promise<PetProfile | null> => {
    try {
      setLoading(true);
      setMessage(null);

      if (!token) throw new Error("Not authenticated");

      const response = await getPetProfileApi(id, token);
      setPet(response.data);
      setMessage(response.message);
      return response.data;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch pet details";
      setMessage(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    pet,
    fetchPet,
    loading,
    message,
  };
}
