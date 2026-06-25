// ..\src\features\pet\hooks\useGetPet.ts

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useState } from "react";
import { getAllUsersApi } from "@/features/users/services/getAllUsers.api";
import { UserProfile } from "@/features/users/types/types";

type SortOrder = "asc" | "desc";

export function useGetAllUsers() {
  
  const { token, user } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [usersRole, setUsersRole] = useState<string>("");

const role = user?.role

const setAllUsers = (value: "STAFF" | "CUSTOMER" | "ADMIN" | "") => {
  if (role !== "ADMIN") return;
  setUsersRole(value);
};

const handleSorting = () => {
  setSortOrder(prev => prev === "asc" ? "desc" : "asc");
}





  const fetchAllUsers = async (): Promise<UserProfile[] | null> => {
    try {
      setLoading(true);
      setMessage(null);
      if (!token) throw new Error("Not authenticated");
        const response = await getAllUsersApi(token, sortOrder, usersRole);
        const fetchedCustomers = response.users
        setUsers(response.users);
      setMessage(response.message);
      
      return fetchedCustomers;
    } catch (err: any) {
      const msg = err?.message || "Failed to fetch pets";
      setMessage(msg);
      return null;
    } finally {
      setLoading(false);
    }
  };
    return {
        fetchAllUsers,
        users,
    loading,
    message, 
    handleSorting,
    sortOrder,
    usersRole,
    setAllUsers
  };
}
