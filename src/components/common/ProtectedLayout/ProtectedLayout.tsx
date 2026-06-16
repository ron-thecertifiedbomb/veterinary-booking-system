// src/components/guards/ProtectedLayout.tsx

import Loader from "@/components/common/Loader/Loader";
import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    role?: "ADMIN" | "STAFF" | "CUSTOMER"; 
    fallback?: string; 
};

export default function ProtectedLayout({
    role,
    fallback = "/(auth)/login",
}: Props) {
    const { user, loading, isAuthenticated } = useAuth();

    // ✅ loading state
    if (loading) return <Loader fullScreen={false} size="small" />;

    // ✅ auth check
    if (!isAuthenticated) {
        return <Redirect href={fallback} />;
    }

    // ✅ role check
    if (role && user?.role !== role) {
        return <Redirect href={fallback} />;
    }


    return (
        <SafeAreaView className="flex-1 bg-background">
            <Slot />
        </SafeAreaView>
    );

}
