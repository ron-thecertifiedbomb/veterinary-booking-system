// src/app/(admin-app)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import { Redirect, Slot } from "expo-router";
import { Platform } from "react-native";
import { useAuth } from "@/features/auth/providers/AuthProvider";

export default function AdminAppLayout() {
    const { loading, user } = useAuth();

    if (loading) return <Loader fullScreen={false} size="small" />;

    // ✓ Kick WEB users out — this group is mobile only
    if (Platform.OS === "web") return <Redirect href="/(admin-web)/dashboard" />;

    // ✓ Not logged in
    if (!user) return <Redirect href="/(auth)/login" />;

    // ✓ Logged in but not admin
    if (user.role !== "ADMIN") return <Redirect href="/(app)/(tabs)/home" />;

    return <Slot />;
}