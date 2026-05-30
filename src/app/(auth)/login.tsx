// src/app/(auth)/login.tsx

import ScreenContainer from "@/components/common/layout/ScreenContainer";
import LoginForm from "@/features/admin/forms/loginForm";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useRouter } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

// ✅ reusable type
type LoginPayload = {
    email: string;
    password: string;
};

export default function Login() {
    const router = useRouter();
    const { login, loading } = useAuth();

    // ✅ LOGIC HERE (clean separation)
    const handleLogin = async ({ email, password }: LoginPayload) => {
        try {
            const response = await login({ email, password });

            if (response) {
                showAlert("", response.message);
            }
        } catch (err: any) {
            showAlert("", err.message);
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