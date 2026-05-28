// src/app/index.tsx

import Loader from "@/components/common/Loader/Loader";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Redirect } from "expo-router";
import { Platform } from "react-native";

export default function Index() {
  const { loading,  user } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  // ✅ admin routing
  if (user?.role !== "ADMIN") {
    return (
      <Redirect
        href={
          Platform.OS === "web"
            ? "/(admin-web)/dashboard"
            : "/(admin-app)/(tabs)/dashboard"
        }
      />
    );
  }

  // ✅ normal user routing
  return (
    <Redirect
      href={
        Platform.OS === "web"
          ? "/(web)/web-home"
          : "/(app)/(tabs)/web-home"
      }
    />
  );
}