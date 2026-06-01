// src/app/(admin-web)/_layout.tsx

import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader";


import { useAuth } from "@/features/auth/providers/AuthProvider";
import { adminNav, customerNav } from "@/utils/config/sidebar/sidebar";

import { Redirect, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebLayout() {
  const { user, loading, isAuthenticated } = useAuth();

  // ✅ loading
  if (loading) return <Loader fullScreen={false} size="small" />;

  // ✅ BLOCK: not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ BLOCK: not ADMIN
  if (user?.role !== "CUSTOMER") {
    return <Redirect href="/(auth)/login" />;
  }
  return (

    <DashboardShell navItems={customerNav}>
      <Slot />
    </DashboardShell>

  );
}