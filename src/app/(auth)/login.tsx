import AuthBranding from "@/components/common/AuthForms/AuthBranding";
import AuthScreenShell from "@/components/common/AuthForms/AuthScreenShell";
import LoginForm from "@/components/common/AuthForms/LoginForm";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { LoginPayload } from "@/features/auth/types/auth.login";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import { Linking, Platform, Pressable, Text } from "react-native";

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
    <AuthScreenShell>
      <AuthBranding
        title="Vet Clinic"
        subtitle="Sign in to manage appointments and pet records."
      />
      <LoginForm
        loading={loading}
        onSubmit={handleLogin}
        onRegisterPress={() => router.push("/(auth)/register")}
      />
      {Platform.OS === "web" ? (
        <Pressable
          onPress={() => Linking.openURL("https://service.rondev.com.ph/vet-clinic/")}
          className="mt-6"
          hitSlop={8}
        >
          <Text className="text-sm text-text-muted text-center font-sans underline">
            About this demo · How to use
          </Text>
        </Pressable>
      ) : null}
    </AuthScreenShell>
  );
}
