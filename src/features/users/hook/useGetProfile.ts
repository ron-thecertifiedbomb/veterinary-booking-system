
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";
import { getUser } from "../services/getUser.api";
import { UserProfile } from "../types/types";



export function useGetUser() {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const { token } = useAuth(); 

  const getUserProfile = async (
  )=> {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      if (!token) {
        throw new Error("Not authenticated");
      }
      const response = await getUser(token);
      setUser(response.data)
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
    getUserProfile,
    loading,
    error,
    message,
    user
  };
}
