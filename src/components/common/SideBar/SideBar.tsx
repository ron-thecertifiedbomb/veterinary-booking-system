import { useLogout } from "@/features/auth/hooks/useLogout";
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

    /**
     * ✅ Better active matching
     * Exact match OR nested route match
     */

    const normalize = (path: string) =>
        path.replace(/\(.*?\)/g, "");

    const isActive = (href: string) => {
        const cleanHref = normalize(href);
        const cleanPath = normalize(pathname);

        if (cleanPath === cleanHref) return true;
        return cleanPath.startsWith(`${cleanHref}/`);
    };


    /**
     * ✅ Logout handler
     */
    const handleLogout = async () => {
        const success = await logout();
        if (success) {
            router.replace("/(auth)/login");
        }
    };

    /**
     * ✅ Reusable Nav Item
     */
    const NavItem = ({ item }: { item: NavItemType }) => {
        const active = isActive(item.href);

        return (
            <Link href={item.href} asChild>
                <Pressable
                    onPress={isMobile ? toggleSidebar : undefined}
                    android_ripple={{ color: "#06B6D433" }}
                    style={({ pressed }) => ({
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        marginBottom: 8,
                        borderRadius: 10,

                        // ✅ Background behavior
                        backgroundColor: active
                            ? "#06B6D422"
                            : pressed
                                ? "#F1F5F9"
                                : "transparent",

                        // ✅ Left accent bar
                        borderLeftWidth: active ? 3 : 0,
                        borderLeftColor: "#06B6D4",
                    })}
                >
                    <Text
                        style={{
                            color: active ? "#06B6D4" : "#1f2937",
                            fontWeight: active ? "600" : "500",
                        }}
                    >
                        {item.label}
                    </Text>
                </Pressable>
            </Link>
        );
    };

    /**
     * ✅ Sidebar Layout Content
     */
    const SidebarContent = (
        <View
            style={{
                flex: 1,
                backgroundColor: "#F8FAFC",
                padding: 16,
                borderRightWidth: 1,
                borderColor: "#E5E7EB",
                justifyContent: "space-between",
            }}
        >
            {/* TOP NAV */}
            <View>
                {navItems.map((item) => (
                    <NavItem key={item.href} item={item} />
                ))}
            </View>

            {/* FOOTER */}
            <Pressable
                onPress={handleLogout}
                disabled={loading}
                style={({ pressed }) => ({
                    marginTop: 20,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: loading
                        ? "#1f2937"
                        : pressed
                            ? "#111827"
                            : "black",
                })}
            >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {loading ? "Logging out..." : "Logout"}
                </Text>
            </Pressable>
        </View>
    );

    /**
     * ✅ Desktop Sidebar
     */
    if (!isMobile) {
        return <View style={{ width: 260 }}>{SidebarContent}</View>;
    }

    /**
     * ✅ Mobile Sidebar (Overlay + Slide)
     */
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
                    zIndex: 10,
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
                        backgroundColor: "rgba(0,0,0,0.25)",
                        zIndex: 5,
                    }}
                />
            )}
        </>
    );
}