// ..\src\features\pet\hooks\useGetPets.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Pet } from "@/features/pet/pet.types";
import { logger } from "@/utils/logger/logger";
import { useCallback, useState } from "react";
import { getPetsApi } from "../services/getPets.api";



export function useGetPets() {
  const { token, user } = useAuth();

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchPets = useCallback(async (): Promise<Pet[] | null> => {
    try {
      setLoading(true);
      setMessage(null);

    
      if (!token || !user?.id) {
        throw new Error("Not authenticated");
      }
      const response = await getPetsApi(token);
      const fetchedPets = Array.isArray(response.data) ? response.data : [];
      logger.info('pets', fetchedPets);
      
      setPets(fetchedPets);
      setMessage(response.message);

      return fetchedPets;
    } catch (err: unknown) {
      // Safely handle the unknown error type
      const msg = err instanceof Error ? err.message : "Failed to fetch pets";
      setMessage(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  return {
    pets,
    fetchPets,
    loading,
    message,
  };
}