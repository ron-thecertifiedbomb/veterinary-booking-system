// src/app/(admin-app)/(tabs)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const icon =
    (name: any) =>
        ({ color, size }: any) =>
            <Ionicons name={name} size={size} color={color} />;

export default function AdminAppTabsLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                lazy: true,
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
                    tabBarIcon: icon("grid-outline"),
                }}
            />

            <Tabs.Screen
                name="appointments"
                options={{
                    title: "Appointments",
                    tabBarIcon: icon("time-outline"),
                }}
            />

            <Tabs.Screen
                name="users"
                options={{
                    title: "Users",
                    tabBarIcon: icon("people-outline"),
                }}
            />

            <Tabs.Screen
                name="pets"
                options={{
                    title: "Pets",
                    tabBarIcon: icon("paw-outline"),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: icon("person-outline"),
                }}
            />
        </Tabs>
    );
}