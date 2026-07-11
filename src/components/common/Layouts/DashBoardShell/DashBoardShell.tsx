import Sidebar from "@/components/common/SideBar/SideBar";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { colors, layout } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { ReactNode, useRef, useState } from "react";
import { Animated, Pressable, useWindowDimensions, View } from "react-native";

type Props = {
  children: ReactNode;
  navItems: any[];
};

export default function DashboardShell({ children, navItems }: Props) {
  const { logout, loading } = useAuth();
  const { width } = useWindowDimensions();
  const isMobile = width < 900;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-layout.sidebarWidth)).current;

  const toggleSidebar = () => {
    const toValue = sidebarOpen ? -layout.sidebarWidth : 0;
    Animated.timing(translateX, { toValue, duration: 200, useNativeDriver: false }).start();
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <View className="flex-1 flex-row bg-canvas">
      <Sidebar
        logout={logout}
        loading={loading}
        isMobile={isMobile}
        translateX={translateX}
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        navItems={navItems}
      />

      <View className="flex-1">
        {isMobile && (
          <View
            className="flex-row items-center px-4 bg-surface border-b border-border"
            style={{ height: 56 }}
          >
            <Pressable onPress={toggleSidebar} className="p-2 -ml-2 rounded-lg" hitSlop={8}>
              <Ionicons name="menu-outline" size={22} color={colors.text.primary} />
            </Pressable>
          </View>
        )}
        <View className="flex-1" style={{ minHeight: 0 }}>
          {children}
        </View>
      </View>
    </View>
  );
}
