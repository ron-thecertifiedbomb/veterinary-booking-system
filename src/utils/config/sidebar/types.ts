// ..\src\utils\config\sidebar\types.ts

import { LogOutResponse } from "@/features/auth/types/auth.logout";
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
  user?: string;
  logout: () => Promise<LogOutResponse>,
  loading: boolean;
  navItems: NavItemType[]; 
};
