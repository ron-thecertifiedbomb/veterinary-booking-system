import RegisterForm from "@/components/authentication/forms/RegisterForm";
import ScreenContainer from "@/components/common/Layouts/ScreenContainer/ScreenContainer";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { RegisterPayload } from "@/features/auth/types/auth.registration";

import { showAlert } from "@/hooks/crossPlatformAlert";
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function Registration() {
  const router = useRouter();

  // ✅ useAuth handles session + routing
  const { register, login, loading } = useAuth();

  const handleRegister = async (data: RegisterPayload) => {
    if (loading) return;

    try {
      // ✅ 1. Register
      const response = await register(data);

      showAlert("Success", response.message);
      const loginResponse = await login({
        email: data.email,
        password: data.password,
      });

      const target = getRouteByRole(loginResponse.user.role, true);
      router.replace(target);
    }
    catch (err: any) {
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 24,
          }}
        >
          <RegisterForm
            loading={loading}
            onSubmit={handleRegister}
            onLoginPress={() => router.push("/(auth)/login")}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}