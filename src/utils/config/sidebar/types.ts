import { Animated } from "react-native";

export type NavItemType = {
  label: string;
  href: string;
};

 export type SidebarProps = {
  isMobile: boolean;
  translateX: Animated.Value;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  navItems: NavItemType[]; 
};
