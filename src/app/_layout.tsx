// src/app/(web)/_layout.tsx
import "@/global.css";
import { Slot, usePathname, Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {


 

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: "row" }}>
    
      <Slot />
    
    </SafeAreaView>
  );
}