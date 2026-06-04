// src/app/(auth)/login.tsx
import LoginForm from "@/components/authentication/forms/LoginForm";
import ScreenContainer from "@/components/common/Layouts/ScreenContainer/ScreenContainer";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { LoginPayload } from "@/features/auth/types/auth.types";
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

            if (response) {
                showAlert("Success", response.message);

                // ✅ allow AuthProvider to update state first
                setTimeout(() => {
                    const target = getRouteByRole(
                        response.data.user.role,
                        true
                    );

                    router.replace(target);
                }, 2);
            }

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