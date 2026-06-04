// ..\src\features\auth\hooks\useMe.ts

import { useState } from "react";
import { api } from "@/utils/api/api.client";
import { AuthenticatedUser } from "@/features/auth/types/auth.user";

type MeResponse = {
  data: {
    user: AuthenticatedUser;
  };
};

export function useMe() {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchMe(token: string) {
    setLoading(true);
    setError(null);

    try {
      const response = await api<MeResponse>("/api/vet/auth/me", {
        method: "GET",
        token,
      });

      const userData = response.data.user;

      setUser(userData);

      return userData;
    } catch (err: any) {
      setError(err?.message || "Failed to fetch session");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    user,
    loading,
    error,
    fetchMe,
  };
}
