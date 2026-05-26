// src/app/(admin-app)/_layout.tsx

// src/app/(admin-app)/_layout.tsx

import { getStorageItem } from "@/features/auth/storage";
import { Redirect, Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function AppAdminLayout() {
    const pathname = usePathname();

    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const bootstrap = async () => {
            const token = await getStorageItem("access_token");
            const storedUser = await getStorageItem("user");

            setAccessToken(token);

            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }

            setLoading(false);
        };

        bootstrap();
    }, []);

    // ✅ scope guard
    if (!pathname.startsWith("/(admin-app)")) {
        return <Slot />;
    }

    // ✅ loading
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#6b7280" />
            </View>
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
``