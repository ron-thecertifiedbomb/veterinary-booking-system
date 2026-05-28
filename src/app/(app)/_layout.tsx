// src/app/(app)/(tabs)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider"; // ✓ consistent with other layouts
import { Redirect, Slot } from "expo-router";
import { Platform } from "react-native";

export default function AppTabsLayout() {
    const { loading, user } = useAuth();

    if (loading) return <Loader fullScreen={false} size="small" />;

    if (!user) return <Redirect href="/(auth)/login" />;

    if (Platform.OS === "web") return <Redirect href="/(web)/web-home" />; // ✓ fixed path

    if (user.role === "ADMIN") return <Redirect href="/(admin-app)/(tabs)/dashboard" />;

    return <Slot />;
}