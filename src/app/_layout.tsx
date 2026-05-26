// src/app/(web)/_layout.tsx
import "@/global.css";
import { Slot, usePathname, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Pressable,
  useWindowDimensions,
  Animated,
} from "react-native";
import { useEffect, useState, useRef } from "react";

import { getStorageItem } from "@/features/auth/storage";
import Sidebar from "@/components/common/SideBar/SideBar";


export default function WebUserLayout() {
  const pathname = usePathname();

  // ✅ Responsive detection
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // ✅ Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -250 : 0;

    Animated.timing(translateX, {
      toValue,
      duration: 250,
      useNativeDriver: true,
    }).start();

    setSidebarOpen(!sidebarOpen);
  };

  // ✅ Auth state
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // ✅ ✅ CRITICAL: scope only to (web)
  if (!pathname.startsWith("/(web)")) {
    return <Slot />;
  }

  // ✅ Prevent flicker
  if (loading) return null;

  // ✅ Not logged in
  if (!accessToken) {
    return <Redirect href="/(auth)/login" />;
  }

  // ✅ Admin should not stay here
  if (user?.role === "ADMIN") {
    return <Redirect href="/(admin-web)/dashboard" />;
  }

  // ✅ Root redirect
  if (pathname === "/" || pathname === "/(web)") {
    return <Redirect href="/(web)/home" />;
  }

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
      {/* ✅ Sidebar */}
      <Sidebar
        isMobile={isMobile}
        translateX={translateX}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* ✅ Main content */}
      <View style={{ flex: 1 }}>
        {/* ✅ Mobile Header */}
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

        {/* ✅ Page content */}
        <Slot />
      </View>
    </SafeAreaView>
  );
}
``