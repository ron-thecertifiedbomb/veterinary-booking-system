import RegisterForm from "@/components/authentication/forms/RegisterForm";
import ScreenContainer from "@/components/common/layout/ScreenContainer";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { RegisterPayload } from "@/features/auth/types";
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
  const { register, login, loading, user} = useAuth();


  const handleRegister = async (data: RegisterPayload) => {
    if (loading) return;

    try {
      const response = await register(data);
      if (!response) return;

      showAlert("", "Account created ✅ Signing you in...");

      const loginResponse = await login({
        email: data.email,
        password: data.password,
      });

      if (!loginResponse) return;

      // ✅ use loginResponse directly, not user from context
      const role = loginResponse.data.user.role;
      const route = getRouteByRole(role);

      router.replace(route);

    } catch (err: any) {
      showAlert("", err?.message || "Registration failed");
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