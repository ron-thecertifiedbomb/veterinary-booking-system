import { colors, iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AppUserLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios" ? 52 + insets.bottom : 60;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
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
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: 2,
          fontFamily: "Inter_500Medium",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Book",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={iconSize.lg}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="appointments"
        options={{
          title: "Visits",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "clipboard" : "clipboard-outline"}
              size={iconSize.lg}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pets"
        options={{
          title: "Pets",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "paw" : "paw-outline"} size={iconSize.lg} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Account",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={iconSize.lg}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
