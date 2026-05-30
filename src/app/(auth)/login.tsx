// src/app/(auth)/login.tsx


import LoginForm from "@/components/authentication/forms/LoginForm";
import ScreenContainer from "@/components/common/layout/ScreenContainer";


import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getRouteByRole } from "@/utils/routes/routeResolver";
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
    const { login, loading, isAuthenticated } = useAuth();

    // ✅ LOGIC HERE (clean separation)

    const handleLogin = async ({ email, password }: LoginPayload) => {

        console.log("isAuthenticated before login:", isAuthenticated);

        try {
            const response = await login({ email, password });

            if (response) {
                showAlert("", response.message);

                // ✅ get role + redirect
                const role = response.data.user.role; // from backend
                const route = getRouteByRole(role); // or "web"

                router.replace(route); // ✅ important (no back)
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