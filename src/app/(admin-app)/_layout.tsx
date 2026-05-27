// src/app/(admin-app)/_layout.tsx
import Loader from "@/components/common/Loader/Loader";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { Redirect, Slot, usePathname } from "expo-router";

export default function AppAdminLayout() {
    const pathname = usePathname();
    const { loading, accessToken, user } = useAuthGuard();

    // ✅ scope guard
    if (!pathname.startsWith("/(admin-app)")) {
        return <Slot />;
    }
    // ✅ loading
    if (loading) {
        return (
            <Loader fullScreen={false} size="small" />
        );
    }
    // ✅ not logged in
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ only ADMIN allowed
    if (user?.role !== "ADMIN") {
        return <Redirect href="/(web)/home" />;
    }
    return <Slot />;
}
