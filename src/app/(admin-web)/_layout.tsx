// src/app/(admin-web)/_layout.tsx

import { Slot, usePathname, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getStorageItem } from "@/features/auth/storage";

export default function AdminWebLayout() {
    const pathname = usePathname();

    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadSession() {
            const token = await getStorageItem("access_token");
            const storedUser = await getStorageItem("user");

            setAccessToken(token);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        }

        loadSession();
    }, []);

    // ✅ ✅ CRITICAL: Ignore routes outside admin-web
    if (!pathname.startsWith("/(admin-web)")) {
        return <Slot />;
    }

    // ✅ prevent flicker
    if (loading) return null;

    // ✅ not authenticated
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ ONLY ADMIN ALLOWED
    if (user?.role !== "ADMIN") {
        return <Redirect href="/(web)/home" />;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Slot />
        </SafeAreaView>
    );
}
``