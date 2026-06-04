// ..\src\features\auth\hooks\useLogout.ts

// src/features/auth/hooks/useLogout.ts
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useState } from "react";

export function useLogout() {
  
  const [loading, setLoading] = useState(false);
  const { logout: authLogout } = useAuth();

  const logout = async () => {
    try {
      setLoading(true);
      await authLogout();
      return true;
    } catch (error: any) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    loading,
  };
}
