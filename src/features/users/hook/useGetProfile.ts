
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";
import { fetchProfileApi } from "../services/fetchProfileApi.api";
import { UserProfile } from "../types/types";



export function useGetProfile() {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { token } = useAuth(); 

  const fetchProfile = async (
  )=> {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (!token) {
        throw new Error("Not authenticated");
      }
      const response = await fetchProfileApi(token);
      setProfile(response.data)
      setMessage(response.message);
      return response;
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to create admin";
      setError(errorMessage);
      logger.error("Add admin failed", err);
      
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchProfile,
    loading,
    error,
    message,
    profile
  };
}
