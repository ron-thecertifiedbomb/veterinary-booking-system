import RegisterForm from "@/components/authentication/forms/RegisterForm";
import ScreenContainer from "@/components/common/Layouts/ScreenContainer/ScreenContainer";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { RegisterPayload } from "@/features/auth/types/auth.types";
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
      const response = await register(data);
      if (!response) return;

      showAlert("Success", response.message);

      const loginResponse = await login({
        email: data.email,
        password: data.password,
      });

      if (!loginResponse) return;


      setTimeout(() => {
        const target = getRouteByRole(
          loginResponse.data.user.role,
          true
        );

        router.replace(target);
      }, 0);
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