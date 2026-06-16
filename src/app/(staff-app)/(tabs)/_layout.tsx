// src/app/(admin-app)/(tabs)/_layout.tsx

import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const icon =
    (name: any) =>
        ({ color, size }: any) =>
            <Ionicons name={name} size={size} color={color} />;

export default function AdminAppTabsLayout() {
       const insets = useSafeAreaInsets();

    // Calculate a comfortable, standard operational height depending on target form factors
    const tabBarHeight = Platform.OS === 'ios' ? 54 + insets.bottom : 64;
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                // Stark high-contrast minimalist monochrome color profiles
                tabBarActiveTintColor: "#000000", 
                tabBarInactiveTintColor: "#A1A1AA", // zinc-400
                tabBarStyle: {
                    height: tabBarHeight,
                    paddingTop: 8,
                    // Safe injection prevents bottom notches from pushing text out of bounds
                    paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
                    borderTopWidth: 1,
                    borderTopColor: "#E4E4E7", // zinc-200 clean hairline border split
                    backgroundColor: "#FFFFFF",
                    elevation: 0, // Removes harsh Android drop shadows
                    shadowOpacity: 0, // Removes iOS border drops
                },
                tabBarLabelStyle: {
                    fontSize: 10, // Slightly smaller brings high-end minimalist editorial feel
                    fontWeight: "700", // Bold weight balances letter structure
                    textTransform: "uppercase", // Matches uppercase tracking rules of other cards
                    letterSpacing: 1.2,
                    marginTop: 4,
                },
                tabBarIconStyle: {
                    marginBottom: 0,
                }
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        // Swaps out outline to solid fill state seamlessly upon active select toggles
                        <Ionicons name={focused ? "home" : "home-outline"} size={20} color={color} />
                    ),
                }}
            />

             <Tabs.Screen
                name="patients"
                options={{
                    title: "Patients",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "paw" : "paw-outline"} size={20} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History", // Shorter title yields optimal horizontal spacing margins
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "calendar" : "calendar-outline"} size={20} color={color} />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person" : "person-outline"} size={20} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}