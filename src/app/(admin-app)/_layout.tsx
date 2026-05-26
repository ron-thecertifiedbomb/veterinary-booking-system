import { getStorageItem } from "@/features/auth/storage";
import { Redirect, Slot, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { View, ActivityIndicator, Platform } from "react-native";

export default function AppAdminLayout() {
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any>(null);

    const pathname = usePathname();

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

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#6b7280" />
            </View>
        );
    }

    // ✅ NOT AUTH
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ ✅ FIXED: only redirect if NOT already inside admin-web
    if (Platform.OS === "web" && !pathname.startsWith("/(admin-web)")) {
        return <Redirect href="/(admin-web)/home" />;
    }

    // ✅ ADMIN users (mobile app)
    if (user?.role === "ADMIN") {
        return <Redirect href="/(admin-app)/dashboard" />;
    }

    return <Slot />;
}