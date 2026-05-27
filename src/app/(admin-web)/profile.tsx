import { Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useRouter } from "expo-router";

export default function Profile() {
    const { logout, loading } = useLogout();
    const router = useRouter();

    const handleLogout = async () => {
        const success = await logout();

        if (success) {
            router.replace("/(auth)/login");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <Text className="text-lg font-semibold mb-6">
                Profile
            </Text>


        </SafeAreaView>
    );
}