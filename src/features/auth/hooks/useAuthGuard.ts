// features/auth/hooks/useAuthGuard.ts

import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getStorageItem } from "@/features/auth/storage";
import { User } from "@/features/users/types";
// adjust path if needed

type UseAuthGuardOptions = {
  redirectTo?: string; // where to send unauthenticated users
};

export function useAuthGuard(options?: UseAuthGuardOptions) {
  const router = useRouter();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const redirectTo = options?.redirectTo ?? "/(auth)/login";

  useEffect(() => {
    async function loadSession() {
      try {
        const token = await getStorageItem("access_token");
        const storedUser = await getStorageItem("user");

        setAccessToken(token);

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        // ✅ redirect if NOT authenticated
        if (!token) {
          router.replace(redirectTo);
        }
      } catch (err) {
        console.error("AuthGuard error:", err);
        router.replace(redirectTo);
      } finally {
        setLoading(false);
      }
    }

    loadSession();
  }, []);

  return {
    accessToken,
    user,
    loading,
    isAuthenticated: !!accessToken,
  };
}
``;
