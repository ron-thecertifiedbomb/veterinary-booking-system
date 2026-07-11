import { showAlert, showConfirm } from "@/hooks/crossPlatformAlert";
import { getNavIcon } from "@/utils/config/sidebar/icons";
import { NavItemType, SidebarProps } from "@/utils/config/sidebar/types";
import { colors, iconSize, layout } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname, useRouter } from "expo-router";
import { Animated, Pressable, Text, View } from "react-native";

export default function Sidebar({
  isMobile,
  translateX,
  sidebarOpen,
  toggleSidebar,
  loading,
  logout,
  navItems,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const getCleanPath = (path: string) => path.replace(/\/?\(.*?\)/g, "");

  const isActive = (href: string) => {
    const current = getCleanPath(pathname);
    const target = getCleanPath(href);
    return current === target || current.startsWith(target + "/");
  };

  const handleLogout = async () => {
    try {
      const response = await logout();
      showAlert("Success", response.message);
      router.replace("(auth)/login");
    } catch (err: any) {
      showAlert("Error", err.message);
    }
  };

  const confirmLogout = () => {
    showConfirm("Sign out", "Are you sure you want to sign out?", handleLogout, "Sign out", true);
  };

  const NavItem = ({ item }: { item: NavItemType }) => {
    const active = isActive(item.href);
    const icon = getNavIcon(item.label);

    return (
      <Link href={item.href} asChild>
        <Pressable
          onPress={isMobile ? toggleSidebar : undefined}
          className="flex-row items-center gap-3 px-3.5 py-3 mb-1 rounded-lg"
          style={({ pressed }) => ({
            backgroundColor: active
              ? colors.sidebarActive
              : pressed
                ? colors.sidebarHover
                : "transparent",
          })}
        >
          <Ionicons
            name={icon}
            size={iconSize.md}
            color={active ? colors.sidebarTextActive : colors.sidebarText}
          />
          <Text
            className="text-sm font-sans"
            style={{
              color: active ? colors.sidebarTextActive : colors.sidebarText,
              fontWeight: active ? "600" : "500",
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      </Link>
    );
  };

  const SidebarContent = (
    <View
      className="flex-1 justify-between"
      style={{
        backgroundColor: colors.sidebar,
        paddingHorizontal: 14,
        paddingTop: 28,
        paddingBottom: 20,
      }}
    >
      <View>
        <View
          className="px-2 pb-6 mb-4"
          style={{ borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.07)" }}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-9 h-9 rounded-lg items-center justify-center bg-white/10">
              <Ionicons name="medical-outline" size={iconSize.lg} color="#fff" />
            </View>
            <View>
              <Text className="text-base font-bold text-white font-sans">Vet Clinic</Text>
              <Text className="text-xs text-sidebarText mt-0.5 font-sans">Patient portal</Text>
            </View>
          </View>
        </View>

        <View>{navItems.map((item) => <NavItem key={item.href} item={item} />)}</View>
      </View>

      <Pressable
        onPress={confirmLogout}
        disabled={loading}
        className="flex-row items-center gap-3 px-3.5 py-3 rounded-lg"
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.sidebarHover : "transparent",
          opacity: loading ? 0.6 : 1,
        })}
      >
        <Ionicons name="log-out-outline" size={iconSize.md} color={colors.sidebarText} />
        <Text className="text-sm text-sidebarText font-medium font-sans">
          {loading ? "Signing out…" : "Sign out"}
        </Text>
      </Pressable>
    </View>
  );

  if (!isMobile) {
    return <View style={{ width: layout.sidebarWidth }}>{SidebarContent}</View>;
  }

  return (
    <>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: layout.sidebarWidth,
          transform: [{ translateX }],
          zIndex: 20,
          backgroundColor: colors.sidebar,
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
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 10,
          }}
        />
      )}
    </>
  );
}
