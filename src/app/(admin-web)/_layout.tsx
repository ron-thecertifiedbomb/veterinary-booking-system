// src/app/(admin-web)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuthGuard } from "@/features/auth/hooks/useAuthGuard";
import { adminNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import { useRef, useState } from "react";
import { Animated, Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminWebLayout() {
    const { accessToken, user, loading } = useAuthGuard();

    // Responsive detection
    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const translateX = useRef(new Animated.Value(-250)).current;

    const toggleSidebar = () => {
        const toValue = sidebarOpen ? -250 : 0;

        Animated.timing(translateX, {
            toValue,
            duration: 250,
            useNativeDriver: false, // `true` is not supported on web
        }).start();

        setSidebarOpen(!sidebarOpen);
    };

    // ✅ loading
    if (loading) {
        return (
            <Loader fullScreen={false} size="small" />
        );
    }

    // ✅ not authenticated
    if (!accessToken) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ ONLY ADMIN ALLOWED
    if (user?.role !== "ADMIN") {
        return <Redirect href="/(web)/home" />;
    }

    return (
        <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>

            <Sidebar
                isMobile={isMobile}
                translateX={translateX}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                navItems={adminNav}
            />

            <View style={{ flex: 1 }}>
                {/* Mobile Header with hamburger icon */}
                {isMobile && (
                    <View
                        style={{
                            height: 60,
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            borderBottomWidth: 1,
                            borderColor: "#e5e7eb",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Pressable onPress={toggleSidebar}>
                            <Text style={{ fontSize: 22, color: "#000" }}>
                                ☰
                            </Text>
                        </Pressable>
                    </View>
                )}

                {/* Page content */}
                <Slot />
            </View>
        </SafeAreaView>
    );
}
