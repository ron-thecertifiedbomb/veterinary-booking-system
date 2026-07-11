// ..\src\features\pet\hooks\useGetPet.ts

import { getAllStaffApi } from "@/features/admin/services/getAllStaff.api";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useState } from "react";
import { getAllCustomerApi } from "../services/getAllCustomers.apit";

export function useGetAllCustomers() {
  const { token } = useAuth();
  const [allCustomers, setAllCustomers] = useState<AuthenticatedUser[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchAllCustomers = async (): Promise<AuthenticatedUser[] | null> => {
    try {
      setLoading(true);
      setMessage(null);
      if (!token) throw new Error("Not authenticated");
        const response = await getAllCustomerApi(token);
        const fetchedCustomers = response.data
        setAllCustomers(response.data);
      setMessage(response.message);
      
      return fetchedCustomers;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch customers";
      setMessage(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };

    return {
        fetchAllCustomers,
      allCustomers,
    loading,
    message,
  };
}
