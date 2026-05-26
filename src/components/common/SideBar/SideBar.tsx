import { useLogout } from "@/features/auth/hooks/useLogout";
import { Link, usePathname, useRouter } from "expo-router";
import { Animated, Pressable, Text, View } from "react-native";

type SidebarProps = {
    isMobile: boolean;
    translateX: Animated.Value;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
};

export default function Sidebar({
    isMobile,
    translateX,
    sidebarOpen,
    toggleSidebar,
}: SidebarProps) {

    const pathname = usePathname();
    const router = useRouter();
    const { logout, loading } = useLogout();

    // ✅ navigation config
    const navItems = [
        { label: "Home", href: "/(web)/home" },
        { label: "Appointments", href: "/(web)/appointments" },
        { label: "Pets", href: "/(web)/pets" },
        { label: "Schedule", href: "/(web)/schedule" },
        { label: "Profile", href: "/(web)/profile" },
    ];

    // ✅ logout handler (TOP LEVEL ✅)
    const handleLogout = async () => {
        const success = await logout();

        if (success) {
            router.replace("/(auth)/login");
        }
    };

    // ✅ nav item component
    const NavItem = ({ label, href }: { label: string; href: string }) => {
        const active = pathname.startsWith(href);

        return (
            <Link href={href} asChild>
                <Pressable
                    onPress={isMobile ? toggleSidebar : undefined}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        marginBottom: 8,
                        borderRadius: 10,
                        backgroundColor: active ? "#06B6D422" : "transparent",
                    }}
                >
                    <Text
                        style={{
                            color: active ? "#06B6D4" : "#1f2937",
                            fontWeight: active ? "600" : "500",
                        }}
                    >
                        {label}
                    </Text>
                </Pressable>
            </Link>
        );
    };

    const SidebarContent = (
        <View
            style={{
                flex: 1,
                backgroundColor: "#F8FAFC",
                padding: 16,
                borderRightWidth: 1,
                borderColor: "#E5E7EB",
                justifyContent: "space-between", // ✅ important for footer
            }}
        >

            {/* TOP */}
            <View>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "700",
                        color: "#0F172A",
                        marginBottom: 20,
                    }}
                >
                    Dashboard
                </Text>

                <View>
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            label={item.label}
                            href={item.href}
                        />
                    ))}
                </View>
            </View>

            {/* ✅ BOTTOM LOGOUT */}
            <Pressable
                onPress={handleLogout}
                disabled={loading}
                style={{
                    marginTop: 20,
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    backgroundColor: "black",
                }}
            >
                <Text style={{ color: "#fff", fontWeight: "600" }}>
                    {loading ? "Logging out..." : "Logout"}
                </Text>
            </Pressable>

        </View>
    );

    // ✅ Desktop
    if (!isMobile) {
        return <View style={{ width: 260 }}>{SidebarContent}</View>;
    }

    // ✅ Mobile
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