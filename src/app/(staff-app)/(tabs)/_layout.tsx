import { colors } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function StaffAppTabsLayout() {
    const insets = useSafeAreaInsets();
    const tabBarHeight = Platform.OS === "ios" ? 50 + insets.bottom : 58;

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.accent,
                tabBarInactiveTintColor: colors.text.muted,
                tabBarStyle: {
                    height: tabBarHeight,
                    paddingTop: 6,
                    paddingBottom: Platform.OS === "ios" ? insets.bottom : 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    backgroundColor: colors.surface,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "500",
                    marginTop: 2,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Today",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "today" : "today-outline"}
                            size={20}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="patients"
                options={{
                    title: "Patients",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "paw" : "paw-outline"}
                            size={20}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="history"
                options={{
                    title: "History",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "time" : "time-outline"}
                            size={20}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    title: "Account",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "person-circle" : "person-circle-outline"}
                            size={20}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}
