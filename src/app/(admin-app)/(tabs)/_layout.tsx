import { getStorageItem } from "@/features/auth/storage";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

export default function AppAdminTabsLayout() {
    const insets = useSafeAreaInsets();

    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    // ✅ block web (FIXED path)
    if (Platform.OS === "web") {
        return <Redirect href="/(admin-web)/dashboard" />;
    }

    useEffect(() => {
        const bootstrap = async () => {
            const token = await getStorageItem("access_token");
            const storedUser = await getStorageItem("user");

            setAccessToken(token);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        };

        bootstrap();
    }, []);

    // ✅ wait for loading
    if (loading) return null;

    // ✅ not logged in
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ ✅ FIXED: ONLY ADMIN allowed
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
                name="schedule"
                options={{
                    title: "Schedule",
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? "calendar" : "calendar-outline"}
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
