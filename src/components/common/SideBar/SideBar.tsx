import { useLogout } from "@/features/auth/hooks/useLogout";
import { showConfirm } from "@/hooks/crossPlatformAlert";
import { NavItemType, SidebarProps } from "@/utils/config/sidebar/types";

import { Link, usePathname, useRouter } from "expo-router";
import { Animated, Pressable, Text, View } from "react-native";

export default function Sidebar({
    isMobile,
    translateX,
    sidebarOpen,
    toggleSidebar,
    navItems,
}: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, loading } = useLogout();



    const getCleanPath = (path: string) => {
        return path.replace(/\/?\(.*?\)/g, "");
    };

    const isActive = (href: string) => {
        const current = getCleanPath(pathname);
        const target = getCleanPath(href);

        return current === target || current.startsWith(target + "/");
    };

    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            router.replace("/(auth)/login");
        }
    };

    const confirmLogout = () => {
        showConfirm(
            "Logout",
            "Are you sure you want to logout?",
            handleLogout,
            "Logout",
            true
        );
    };

    // ✅ NAV ITEM (UPGRADED)
    const NavItem = ({ item }: { item: NavItemType }) => {
        const active = isActive(item.href);

        return (
            <Link href={item.href} asChild>
                <Pressable
                    onPress={isMobile ? toggleSidebar : undefined}
                    style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",

                        paddingVertical: 14,
                        paddingHorizontal: 18,

                        borderRadius: 12,

                        backgroundColor: active
                            ? "#F1F5F9"
                            : pressed
                                ? "#F8FAFC"
                                : "transparent",

                        borderLeftWidth: active ? 3 : 0,
                        borderLeftColor: "#111827",

                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    })}
                >
                    <Text
                        style={{
                            color: active ? "#111827" : "#64748B",
                            fontWeight: active ? "700" : "500",
                            fontSize: 18,
                        }}
                    >
                        {item.label}
                    </Text>
                </Pressable>
            </Link>
        );
    };

    // ✅ SIDEBAR CONTENT
    const SidebarContent = (
        <View
            style={{
                flex: 1,
                backgroundColor: "#FFFFFF",
                padding: 18,
                borderRightWidth: 1,
                borderColor: "#E5E7EB",
                justifyContent: "space-between",
            }}
        >
            {/* 🔥 HEADER BRAND */}

            <View style={{ marginBottom: 28 }}>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: "700",
                        color: "#0F172A",
                    }}
                >
                    Veterianry Clinic
                </Text>

                <Text
                    style={{
                        fontSize: 12,
                        color: "#94A3B8",
                        marginTop: 2,
                    }}
                >
                    Management System
                </Text>
            </View>


            {/* ✅ NAV */}

            <View style={{ flex: 1, marginTop: 10, gap: 10 }}>
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}
            </View>


            {/* ✅ FOOTER */}
            <View style={{ marginTop: 12 }}>
                <Pressable
                    onPress={confirmLogout}
                    disabled={loading}
                    style={({ pressed }) => ({
                        paddingVertical: 12,
                        borderRadius: 12,
                        alignItems: "center",

                        backgroundColor: loading
                            ? "#1e293b"
                            : pressed
                                ? "#111827"
                                : "black",

                        transform: [{ scale: pressed ? 0.97 : 1 }],
                    })}
                >
                    <Text
                        style={{
                            color: "#fff",
                            fontWeight: "600",
                        }}
                    >
                        {loading ? "Logging out..." : "Logout"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );

    // ✅ DESKTOP
    if (!isMobile) {
        return (
            <View
                style={{
                    width: 260,
                    shadowColor: "#000",
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                }}
            >
                {SidebarContent}
            </View>
        );
    }

    // ✅ MOBILE (UPGRADED)
    return (
        <>
            <Animated.View
                style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: 260,
                    transform: [{ translateX }],
                    zIndex: 20,
                    backgroundColor: "#fff",
                    shadowColor: "#000",
                    shadowOpacity: 0.1,
                    shadowRadius: 20,
                }}
            >
                {SidebarContent}
            </Animated.View>

            {sidebarOpen && (
                <Pressable
                    onPress={toggleSidebar}
                    style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "rgba(2,6,23,0.35)",
                        zIndex: 10,
                    }}
                />
            )}
        </>
    );
}