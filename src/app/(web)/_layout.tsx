// src/app/(web)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import Sidebar from "@/components/common/SideBar/SideBar";

import { useAuth } from "@/features/auth/providers/AuthProvider";

import { userNav } from "@/utils/config/sidebar/sidebar";

import { getRouteByRole } from "@/utils/routes/routeResolver";

import {
  Redirect,
  Slot,
} from "expo-router";

import {
  useRef,
  useState,
} from "react";

import {
  Animated,
  Platform,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

export default function WebUserLayout() {
  const {
    user,
    loading,
    isAuthenticated,
  } = useAuth();

  const { width } =
    useWindowDimensions();

  const isMobile = width < 768;
  const isFirstLoad = !user && loading; 
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const translateX = useRef(
    new Animated.Value(-250)
  ).current;

  const toggleSidebar = () => {
    const toValue = sidebarOpen
      ? -250
      : 0;

    Animated.timing(translateX, {
      toValue,
      duration: 250,
      useNativeDriver: false,
    }).start();

    setSidebarOpen(!sidebarOpen);
  };

  // ✅ loading state
  if (isFirstLoad) {
    return (
      <Loader
        fullScreen
 
      />
    );
  }
  // ✅ auth guard
  if (!isAuthenticated || !user) {
    return (
      <Redirect
        href={getRouteByRole(undefined, {
          isAuthenticated: false,
        })}
      />
    );
  }

  // ✅ wrong platform
  if (Platform.OS !== "web") {
    return (
      <Redirect
        href="/(app)/(tabs)/home"
      />
    );
  }

  // ✅ prevent admin from entering user layout
  if (user.role === "ADMIN") {
    return (
      <Redirect
        href={getRouteByRole(
          user.role,
          {
            isAuthenticated: true,
          }
        )}
      />
    );
  }
  if (user.role === "STAFF") {
    return (
      <Redirect
        href={getRouteByRole(
          user.role,
          {
            isAuthenticated: true,
          }
        )}
      />
    );
  }
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
      }}
    >
      {/* ✅ SIDEBAR */}
      <Sidebar
        isMobile={isMobile}
        translateX={translateX}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={userNav}
      />

      {/* ✅ CONTENT */}
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
            <Pressable
              onPress={toggleSidebar}
            >
              <Text
                style={{ fontSize: 22 }}
              >
                ☰
              </Text>
            </Pressable>
          </View>
        )}

        <Slot />
      </View>
    </View>
  );
}