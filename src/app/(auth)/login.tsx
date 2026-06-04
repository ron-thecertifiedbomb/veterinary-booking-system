// src/app/(auth)/login.tsx
import LoginForm from "@/components/authentication/forms/LoginForm";
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
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    contentContainerClassName="flex-grow justify-center items-center"
                    keyboardShouldPersistTaps="handled"
                >
                    <LoginForm
                        loading={loading}
                        onSubmit={handleLogin}
                        onRegisterPress={() => router.push("/(auth)/register")}
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}