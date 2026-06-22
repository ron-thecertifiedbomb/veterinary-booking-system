// src/app/(admin-web)/_layout.tsx

import Container from "@/components/common/Container/Container";
import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader"; // Ensure you import this!
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { customerNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import { View } from "react-native";

export default function WebLayout() {
  const { user, isAuthenticated, loading } = useAuth();

  // 1. ALWAYS handle the loading state first to prevent premature redirects
  if (loading) {
    return <Loader fullScreen />; // or return null;
  }

  // 2. Use <Redirect /> instead of router.replace() during render
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  // 3. Role check (Make sure this shouldn't be "ADMIN" based on the folder name!)
  if (user?.role !== "CUSTOMER") {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <DashboardShell navItems={customerNav}>
      <Container className="flex-1 w-full">
        <View className="flex-1 px-4 lg:pt-20"> 
          <View className="w-full max-w-2xl mx-auto flex-1"> 
            <Slot />
          </View>
        </View>
      </Container>
    </DashboardShell>
  );
}