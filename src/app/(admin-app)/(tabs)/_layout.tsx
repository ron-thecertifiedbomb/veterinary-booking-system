// src/app/(admin-app)(tabs)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppAdminTabsLayout() {
    const insets = useSafeAreaInsets();
    const { loading, accessToken, user } = useAuthGuard();

    if (Platform.OS === "web") {
        return <Redirect href="/(admin-web)/dashboard" />;
    }
    // ✅ loading
    if (loading) {
        return (
            <Loader fullScreen={false} size="small" />
        );
    }


    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    if (user?.role !== "ADMIN") {
        return <Redirect href="/(web)/home" />;
    }

    return (
        <Tabs
            initialRouteName="dashboard"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#111827",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    height: 64 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: Math.max(insets.bottom, 12),
                    borderTopWidth: 0,
                    backgroundColor: "#FFFFFF",
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: "500",
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "grid" : "grid-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="appointments"
                options={{
                    title: "Appointments",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "clipboard" : "clipboard-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="users"
                options={{
                    title: "Users",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "people" : "people-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"}
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
