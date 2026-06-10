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
                tabBarActiveTintColor: "#111827",
                tabBarInactiveTintColor: "#9CA3AF",
                tabBarStyle: {
                    height: 27 + insets.bottom,
                    paddingTop: 4,
                    paddingBottom: Math.max(insets.bottom, 4),
                    borderTopWidth: 0,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12
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
                    title: "Home",
                    tabBarIcon: icon("home-outline"),
                }}
            />

            <Tabs.Screen
                name="appointments"
                options={{
                    title: "Appointments",
                    tabBarIcon: icon("calendar-outline"),
                }}
            />

            <Tabs.Screen
                name="patients"
                options={{
                    title: "Patients",
                    tabBarIcon: icon("paw-outline"),
                }}
            />

            <Tabs.Screen
                name="queue"
                options={{
                    title: "Queue",
                    tabBarIcon: icon("list-outline"),
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