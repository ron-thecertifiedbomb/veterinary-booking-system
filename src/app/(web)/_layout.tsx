// src/app/(web)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";

import { userNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WebUserLayout() {
  const { accessToken, user, loading } = useAuthGuard();

  // Responsive detection
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -250 : 0;

    Animated.timing(translateX, {
      toValue,
      duration: 250,
      useNativeDriver: false, // `true` is not supported on web
    }).start();

    setSidebarOpen(!sidebarOpen);
  };

  // Prevent flicker while session is loading
  if (loading) {
    return (
      <Loader fullScreen={false} size="small" />
    );
  }

  // Not authenticated, redirect to login
  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // If user is not a 'USER', redirect to admin dashboard
  if (user?.role !== "USER") {
    return <Redirect href="/(admin-web)/dashboard" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>

      <Sidebar
        isMobile={isMobile}
        translateX={translateX}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={userNav}
      />

      <View style={{ flex: 1 }}>
        {/* Mobile Header with hamburger icon */}
        {isMobile && (
          <View
            style={{
              height: 60,
              justifyContent: "center",
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderColor: "#e5e7eb",
              backgroundColor: "#fff",
            }}
          >
            <Pressable onPress={toggleSidebar}>
              <Text style={{ fontSize: 22 }}>☰</Text>
            </Pressable>
          </View>
        )}

        {/* Page content */}
        <Slot />
      </View>
    </SafeAreaView>
  );
}
