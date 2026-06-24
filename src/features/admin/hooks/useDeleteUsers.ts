// ..\src\features\appointment\hooks\useAssignStaff.ts

import { useState} from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { deleteUsersApi } from "../services/deleteUsers.api";

export const useDeleteUsers = () => {
  const { token } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const deleteUsers = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      if (!token) {
        throw new Error("Unauthorized. Please login again.");
      }
      const response = await deleteUsersApi(selectedIds,  token);
      setMessage(response.message);
      return true; 
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to delete appointment";
      setError(errorMessage);
      logger.error("Failed to delete appointment", errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIds = (selectedId: string) => {
    if (!selectedId) return;
  
    setSelectedIds((prevIds) => {
      // If already selected, remove it from the list
      if (prevIds.includes(selectedId)) {
        return prevIds.filter((id) => id !== selectedId);
      }
      // Otherwise, add it to the list
      return [...prevIds, selectedId];
    });
  };


  return {
    deleteUsers,
    loading,
    error,
    message,
    handleSelectIds,
    selectedIds
  };
};
