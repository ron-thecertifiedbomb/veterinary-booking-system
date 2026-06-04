// ..\src\features\users\hook\useGetUserProfile.ts

import {
  getStorageItem,
  setStorageItem,
} from "@/features/auth/storage/auth.storage";
import { GetUserProfileResponse, UserProfile } from "@/features/users/types";
import { api } from "@/utils/api/api.client";
import { logger } from "@/utils/logger/logger";
import { useState } from "react";

export const useGetUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      if (loading) return null;
      setLoading(true);
      setError(null);

      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }
      const response = await api<GetUserProfileResponse>("/api/vet/users/me", {
        method: "GET",
        token,
      });
      await setStorageItem("user_profile", JSON.stringify(response.data));
      setProfile(response.data);
      return response.data;
    } catch (err: any) {
      logger.error("Error fetching profile ❌", err);
      const message = err?.message || "Failed to fetch user profile";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  return {
    fetchUserProfile,
    profile,
    loading,
    error,
  };
};
