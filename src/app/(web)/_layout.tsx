// src/app/(web)/_layout.tsx

import { Redirect, Slot, usePathname } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Sidebar from "@/components/common/SideBar/SideBar";
import { getStorageItem } from "@/features/auth/storage";

export default function WebUserLayout() {
  const pathname = usePathname();

  // Auth state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    async function loadSession() {
      const token = await getStorageItem("access_token");
      const storedUser = await getStorageItem("user");

      setAccessToken(token);

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setLoading(false);
    }

    loadSession();
  }, []);

  // Prevent flicker while session is loading
  if (loading) return null;

  // Not authenticated, redirect to login
  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // If user is not a 'USER', redirect to admin dashboard
  if (user?.role !== "USER") {
    return <Redirect href="/(admin-web)/dashboard" />;
  }

  // Redirect from root of group to home screen
  if (pathname === "/" || pathname === "/(web)") {
    return <Redirect href="/(web)/home" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
      {/* Sidebar */}
      <Sidebar
        isMobile={isMobile}
        translateX={translateX}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main content */}
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
