// ..\src\features\pet\hooks\useGetPet.ts

import { getAllStaffApi } from "@/features/admin/services/getAllStaff.api";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useState } from "react";

export function useAllGetStaff() {
  const { token } = useAuth();
  const [allStaff, setAllStaff] = useState<AuthenticatedUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchAllStaff = async (): Promise<AuthenticatedUser[] | null> => {
    try {
      setLoading(true);
      setMessage(null);
      if (!token) throw new Error("Not authenticated");
        const response = await getAllStaffApi(token);
        const fetchedStaff = response.data
      setAllStaff(response.data);
      setMessage(response.message);
      
      return fetchedStaff;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch staff";
      setMessage(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

    return {
      fetchAllStaff,
    allStaff,
    loading,
    message,
  };
}
