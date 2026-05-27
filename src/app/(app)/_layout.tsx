import Loader from "@/components/common/Loader/Loader";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";

import { Redirect, Slot } from "expo-router";
import { Platform } from "react-native";

export default function AppLayout() {
    const { loading, accessToken, user } = useAuthGuard();

    // ✅ loading
    if (loading) {
        return (
            <Loader fullScreen={false} size="small" />
        );
    }
    // ✅ NOT AUTHENTICATED → GO TO LOGIN
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ WEB USERS → SEPARATE EXPERIENCE
    if (Platform.OS === "web") {
        return <Redirect href="/(web)/home" />;
    }

    // ✅ ADMIN USERS → ADMIN DASHBOARD
    if (user?.role === "ADMIN") {
        return <Redirect href="/(admin-app)/(tabs)/dashboard" />;
    }

    // ✅ NORMAL USERS → ALLOW APP ACCESS
    return <Slot />;
}
