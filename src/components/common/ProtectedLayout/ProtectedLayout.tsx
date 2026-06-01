// src/components/guards/ProtectedLayout.tsx

import Loader from "@/components/common/Loader/Loader";
import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/features/auth/providers/AuthProvider";

type Props = {
    role?: "ADMIN" | "STAFF" | "CUSTOMER"; // optional role restriction
    fallback?: string; // optional fallback route
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

    return <Slot />;
}
``