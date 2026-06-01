// src/app/(admin-web)/_layout.tsx

import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader";


import { useAuth } from "@/features/auth/providers/AuthProvider";
import { adminNav } from "@/utils/config/sidebar/sidebar";

import { Redirect, Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminWebLayout() {
    const { user, loading, isAuthenticated } = useAuth();

    // ✅ loading
    if (loading) return <Loader fullScreen={false} size="small" />;

    // ✅ BLOCK: not authenticated
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ BLOCK: not ADMIN
    if (user?.role !== "ADMIN") {
        return <Redirect href="/(auth)/login" />;
    }
    return (
    
            <DashboardShell navItems={adminNav}>
                <Slot />
            </DashboardShell>

    );
}