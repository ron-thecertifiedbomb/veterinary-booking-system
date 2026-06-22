// ..\src\features\pet\hooks\useGetOnePet.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Pet } from "@/features/pet/pet.types";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";
import {  getPetProfileApi } from "../services/getPetProfile.api";

export function useGetPetProfile() {
  const { token } = useAuth();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ✅ Added the 'id' parameter here
  const fetchPet = async (id: string): Promise<Pet | null> => {
    try {
      setLoading(true);
      setMessage(null);

      if (!token) throw new Error("Not authenticated");

      // ✅ Passed 'id' to the API call
      const response = await getPetProfileApi(id, token);

      const fetchedPet = response.data;
      logger.info('Fetched pet:', fetchedPet);

      setPet(fetchedPet);
      setMessage(response.message);

      return fetchedPet;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch pet details";
      setMessage(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cleaned up the return object to match the singular 'pet'
  return {
    pet,
    fetchPet,
    loading,
    message,
  };
}