// src/app/(web)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { userNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Stack } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function WebUserLayout() {
  const { user, loading } = useAuth();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-250)).current;

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -250 : 0;
    Animated.timing(translateX, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) return <Loader fullScreen={false} size="small" />;
  if (Platform.OS !== "web") return <Redirect href="/(app)/(tabs)/home" />;
  if (!user) return <Redirect href="/(auth)/login" />;
  if (user.role === "ADMIN") return <Redirect href="/(admin-web)/dashboard" />;

  return (
    <View style={{ flex: 1, flexDirection: "row" }}> {/* ✓ plain View, no SafeAreaView */}
      <Sidebar
        isMobile={isMobile}
        translateX={translateX}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={userNav}
      />

      <View style={{ flex: 1 }}>
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
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </View>
  );
}