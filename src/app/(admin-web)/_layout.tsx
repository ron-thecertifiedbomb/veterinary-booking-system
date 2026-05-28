// src/app/(admin-web)/_layout.tsx

import Loader from "@/components/common/Loader/Loader";
import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuth } from "@/features/auth/providers/AuthProvider"; // ✓ consistent with other layouts
import { adminNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import { Platform } from "react-native"; // ✓ add platform guard
import { useRef, useState } from "react";
import { Animated, Pressable, Text, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminWebLayout() {
    const { user, loading } = useAuth();

    const { width } = useWindowDimensions();
    const isMobile = width < 768;

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const translateX = useRef(new Animated.Value(-250)).current;

    const toggleSidebar = () => {
        const toValue = sidebarOpen ? -250 : 0;
        Animated.timing(translateX, {
            toValue,
            duration: 250,
            useNativeDriver: false,
        }).start();
        setSidebarOpen(!sidebarOpen);
    };

    if (loading) return <Loader fullScreen={false} size="small" />;

    // ✓ Kick mobile users out — this group is web only
    if (Platform.OS !== "web") return <Redirect href="/(admin-app)/(tabs)/dashboard" />;

    if (!user) return <Redirect href="/(auth)/login" />;

    // ✓ Fixed path — /(web)/web-home not /(web)/home
    if (user.role !== "ADMIN") return <Redirect href="/(web)/web-home" />;

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
                            <Text style={{ fontSize: 22, color: "#000" }}>☰</Text>
                        </Pressable>
                    </View>
                )}

                <Slot />
            </View>
        </SafeAreaView>
    );
}