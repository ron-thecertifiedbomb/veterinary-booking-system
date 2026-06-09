import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";

export default function Profile() {
 
    const router = useRouter();
    const {loading , logout} = useAuth()


    const handleLogout = async () => {
        try {
            const response = await logout();
            const message = response.message
            showAlert("Success", message);
            router.replace("(auth)/login");
        } catch (err: any) {
            showAlert("Error", err.message); 
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <Text className="text-lg font-semibold mb-6">
                Profile
            </Text>

            {/* ✅ Logout Button */}
            <Pressable
                onPress={handleLogout}
                disabled={loading}
                className="bg-black rounded-2xl px-6 py-4 w-full items-center active:opacity-80"
            >
                <Text className="text-white font-semibold text-base">
                    {loading ? "Logging out..." : "Logout"}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}