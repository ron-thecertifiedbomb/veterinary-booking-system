// ..\src\features\users\hook\UpdateProfile.ts

import {
    getStorageItem,
    setStorageItem,
  } from "@/features/auth/storage/auth.storage";
  import { updateCustomerProfilePayload, UpdateCustomerProfileResponse} from "@/features/customer/types/customer.types";
  import { logger } from "@/utils/logger/logger";
  import { useState } from "react";
import { updateCustomerProfileApi } from "../services/updateCustomerProfile.api";
import { useAuth } from "@/features/auth/providers/AuthProvider";
  
  // ✅ types
  
  export function useUpdateCustomerProfile() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
  const {token} = useAuth()


    const updateProfile = async (
      payload: updateCustomerProfilePayload,
    ): Promise<UpdateCustomerProfileResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        setMessage(null);
  
        logger.info("Updating user profile");
  
        // ✅ get token

        if (!token) throw new Error("Not authenticated");
  
        const response = await updateCustomerProfileApi(payload, token);
  
        setMessage(response.message);
  
        logger.info("Profile updated", {
          id: response.data?.id,
        });
  
        // ✅ update stored user (important)
        await setStorageItem("user", JSON.stringify(response.data));
  
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
  