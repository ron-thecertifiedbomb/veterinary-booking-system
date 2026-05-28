// src/app/(auth)/_layout.tsx

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Redirect, Slot } from "expo-router";
import { Platform } from "react-native";

export default function AuthLayout() {
    const { user, loading } = useAuth();

    if (loading) return null;

    // ✓ Already logged in — send them home
    if (user) {
        const isWeb = Platform.OS === "web";

        if (user.role === "ADMIN") {
            return <Redirect href={isWeb ? "/(admin-web)/dashboard" : "/(admin-app)/(tabs)/dashboard"} />;
        }

        return <Redirect href={isWeb ? "/(web)/home" : "/(app)/(tabs)/home"} />;
    }

    return <Slot />;
}