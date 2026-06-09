// src/components/layouts/DashboardShell.tsx

import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { ReactNode, useRef, useState } from "react";
import {
    Animated,
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
    const {logout, loading} = useAuth()
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

    return (
        <View style={{ flex: 1, flexDirection: "row" }}>
            {/* ✅ SIDEBAR */}
            <Sidebar
            logout={logout}
            loading={loading}
                isMobile={isMobile}
                translateX={translateX}
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                navItems={navItems}
            />

            {/* ✅ CONTENT */}
            <View style={{ flex: 1 }}>
                {isMobile && (
                    <View
                        style={{
                            height: 60,
                            justifyContent: "center",
                            paddingHorizontal: 16,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Pressable onPress={toggleSidebar}>
                            <Text style={{ fontSize: 22 }}>☰</Text>
                        </Pressable>
                    </View>
                )}

                {children}
            </View>
        </View>
    );
}
