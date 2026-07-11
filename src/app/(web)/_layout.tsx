import Container from "@/components/common/Container/Container";
import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import {   customerNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";


export default function WebLayout() {
  const { user, loading, isAuthenticated } = useAuth();

  // ✅ loading
  if (loading) return <Loader fullScreen />;

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
      <View className="flex-1 w-full" style={{ minHeight: 0 }}>
        <Slot />
      </View>
    </DashboardShell>
  );
}