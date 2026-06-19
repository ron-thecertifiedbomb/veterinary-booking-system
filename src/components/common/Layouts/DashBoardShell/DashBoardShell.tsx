// src/components/layouts/DashboardShell.tsx

import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { isMobile as staticIsMobile } from "@/utils/dimension/dimension";
import { ReactNode, useRef, useState } from "react";
import {
    Animated,
    Platform,
    Pressable,
    Text,
    useWindowDimensions,
    View,
} from "react-native";

type Props = {
    children: ReactNode;
    navItems: any[];
};

export default function DashboardShell({ children, navItems }: Props) {
    // 1. Instantly return null if the application is running on iOS or Android
    if (Platform.OS !== "web") {
        return null;
    }

    const { logout, loading } = useAuth();
    
    // 2. Track browser window width dynamically for desktop resizing
    const { width } = useWindowDimensions();

    // 3. True if the browser window is dragged down to a small size or explicitly mobile sizing
    const isMobileView = width < 768 || staticIsMobile;

    const sidebarWidth = 250;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const translateX = useRef(new Animated.Value(-sidebarWidth)).current;

    const toggleSidebar = () => {
        const toValue = sidebarOpen ? -sidebarWidth : 0;

        Animated.timing(translateX, {
            toValue,
            duration: 250,
            useNativeDriver: false, // Must be false for layout property animations on web view frameworks
        }).start();

        setSidebarOpen(!sidebarOpen);
    };

    return (
        <View style={{ flex: 1, flexDirection: "row", width: "100%" }}>
            {/* ✅ SIDEBAR COMPONENT */}
            <Sidebar
                logout={logout}
                loading={loading}
                isMobile={isMobileView}
                translateX={translateX}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                navItems={navItems}
            />

            {/* ✅ CONTENT CONTAINER */}
            <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
                {/* ✅ RESPONSIVE HAMBURGER BAR (Only renders on web if the browser is narrow) */}
                {isMobileView && (
                    <View
                        style={{
                            height: 60,
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            backgroundColor: "#fff",
                            borderBottomWidth: 1,
                            borderBottomColor: "#f4f4f5",
                        }}
                    >
                        <Pressable onPress={toggleSidebar}>
                            <Text style={{ fontSize: 24, fontWeight: "bold" }}>☰</Text>
                        </Pressable>
                    </View>
                )}

                {/* ✅ RENDER TARGET VIEW CONTENT */}
                <View style={{ flex: 1 }}>
                    {children}
                </View>
            </View>
        </View>
    );
}
