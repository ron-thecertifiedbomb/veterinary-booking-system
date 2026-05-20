import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import Navbar from "@/components/web/NavBar";
import { customerNav } from "@/utils/config/nav";


export default function WebLayout() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Navbar items={customerNav} />

      <View className="flex-1">
        <Slot />
      </View>
    </SafeAreaView>
  );
}
