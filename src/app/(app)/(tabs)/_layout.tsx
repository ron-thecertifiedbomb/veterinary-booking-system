import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Platform } from "react-native";

export default function AppUserLayout() {
    const insets = useSafeAreaInsets();

    const tabBarHeight = Platform.OS === 'ios' ? 54 + insets.bottom : 64;

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "#000000", 
            tabBarInactiveTintColor: "#A1A1AA", 
            tabBarStyle: {
                height: tabBarHeight,
                paddingTop: 8,
                paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
                borderTopWidth: 1,
                borderTopColor: "#E4E4E7", 
                backgroundColor: "#FFFFFF",
                elevation: 0, 
                shadowOpacity: 0, 
            },
            tabBarLabelStyle: {
                fontSize: 10, 
                fontWeight: "700", 
                textTransform: "uppercase", 
                letterSpacing: 1.2,
                marginTop: 4,
            },
            tabBarIconStyle: {
                marginBottom: 0,
            }
        }}
    >
        <Tabs.Screen
            name="home"
            options={{
                title: "Home",
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? "home" : "home-outline"} size={20} color={color} />
                ),
            }}
        />

        {/* Targets 'appointment/index.tsx' for your list view */}
        <Tabs.Screen
            name="appointments"
            options={{
                title: "Appointments", 
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? "calendar" : "calendar-outline"} size={20} color={color} />
                ),
            }}
        />

        {/* REMOVED appointment/[id] Screen Block Completely */}

        <Tabs.Screen
            name="pets"
            options={{
                title: "Pets",
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? "paw" : "paw-outline"} size={20} color={color} />
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
