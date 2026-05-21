import { Slot, usePathname } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Navbar from "@/components/web/NavBar";
import { customerNav } from "@/utils/config/nav";

export default function WebLayout() {
  const pathname = usePathname();

  const hideNavbar = pathname === "/invalid-time";

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* {!hideNavbar && <Navbar items={customerNav} />} */}

 
        <Slot />

    </SafeAreaView>
  );
}
