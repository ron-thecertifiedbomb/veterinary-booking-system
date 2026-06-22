// ..\src\features\users\hook\UpdateProfile.ts

import {
  getStorageItem,
  setStorageItem,
} from "@/features/auth/storage/auth.storage";

import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";
import { UpdateUserProfilePayload, UpdateUserProfileResponse } from "../types/types";
import { updateProfileApi } from "../services/updateProfile.api";
import { useAuth } from "@/features/auth/providers/AuthProvider";

// ✅ types

export function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const updateProfile = async ( payload: UpdateUserProfilePayload,
  ): Promise<UpdateUserProfileResponse | null> => {

    const { token } = useAuth(); 
    if (!token ) throw new Error("Not authenticated");
    
    try {
      if (!payload ) throw new Error("empty payload");
      setLoading(true);
      setError(null);
      setMessage(null);
      const response = await updateProfileApi(token, payload)
      setMessage(response.message);
      return response;
    } catch (err: any) {
      logger.error("Update profile failed", err);

      const errorMessage = err?.message || "Failed to update profile";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
      logger.info("Update profile completed");
    }
  };

  return {
    updateProfile,
    loading,
    error,
    message,
  };
}
