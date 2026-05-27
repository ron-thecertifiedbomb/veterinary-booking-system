import { api } from "@/utils/api";
import { logger } from "@/utils/logger";
import { useState } from "react";
import { getStorageItem, setStorageItem } from "@/features/auth/storage";
import { GetUserProfileResponse, UserProfile } from "@/features/users/types";


export const useGetUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchUserProfile = async (): Promise<UserProfile | null> => {
    try {
      if (loading) return null;

      setLoading(true);
      setError(null);

      // ✅ Get token
      const token = await getStorageItem("access_token");
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }

      logger.info("Fetching user profile ✅");

      // ✅ API call (NO PAYLOAD)
      const res = await api<GetUserProfileResponse>("/api/vet/users/me", {
        method: "GET",
        token, // ✅Bearer token handled inside api util
      });

      logger.info("User profile fetched ✅", res.data);

      // ✅ Save locally (optional but recommended)
      await setStorageItem("user_profile", JSON.stringify(res.data));
      setProfile(res.data);
      return res.data;
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

