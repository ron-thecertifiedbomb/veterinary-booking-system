// src/app/(app)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider"; // ✓ consistent with other layouts
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { Redirect, router, Slot } from "expo-router";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AppTabsLayout() {
    const { loading, user,  isAuthenticated } = useAuth();

    const route = getRouteByRole(
        user?.role,
        {
            isAuthenticated,
        }
    );
    router.replace(route);

    if (loading) return <Loader />;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <Slot />
        </SafeAreaView>
    );
}


     
        
