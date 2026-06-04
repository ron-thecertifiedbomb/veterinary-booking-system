// src/app/(auth)/login.tsx
import LoginForm from "@/components/authentication/forms/LoginForm";
import AnimatedSlide from "@/components/common/AnimatedSlide/AnimatedSlide";
import AppSafeArea from "@/components/common/AppSafeArea/AppSafeArea";
import ScreenContainer from "@/components/common/Layouts/ScreenContainer/ScreenContainer";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { LoginPayload } from "@/features/auth/types/auth.login";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from "react-native";

export default function Login() {

    const router = useRouter();

    const { login, loading } = useAuth();

    const handleLogin = async ({ email, password }: LoginPayload) => {
        try {
            const response = await login({ email, password });

            showAlert("Success", response.message);

            const target = getRouteByRole(response.user.role, true);
            router.replace(target);

        } catch (err: any) {
            showAlert("Error", err.message); 
        }
    };
    return (
        <AppSafeArea>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1 justify-center items-center px-8"
            >
                <AnimatedSlide>
                    <View className="w-full">
                    <LoginForm
                        loading={loading}
                        onSubmit={handleLogin}
                        onRegisterPress={() => router.push("/(auth)/register")}
                    />
                    </View>
                </AnimatedSlide>
            </KeyboardAvoidingView>
        </AppSafeArea>
    );
}