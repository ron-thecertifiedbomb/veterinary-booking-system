import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Navbar from "@/components/web/NavBar";
import { adminNav } from "@/utils/config/nav";


export default function AdminLayout() {
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <Navbar items={adminNav} />
            <Slot />
        </SafeAreaView>
    );
}