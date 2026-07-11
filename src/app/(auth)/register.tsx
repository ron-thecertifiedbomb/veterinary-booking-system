import AuthBranding from "@/components/common/AuthForms/AuthBranding";
import AuthScreenShell from "@/components/common/AuthForms/AuthScreenShell";
import RegistrationForm from "@/components/common/AuthForms/RegistrationForm";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { RegisterPayload } from "@/features/auth/types/auth.registration";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";

export default function RegistrationSceen() {
  const router = useRouter();
  const { register, login, loading } = useAuth();

  const handleRegister = async (data: RegisterPayload) => {
    if (loading) return;

    try {
      const response = await register(data);

      showAlert("Success", response.message);

      const loginResponse = await login({
        email: data.email,
        password: data.password,
      });

      const target = getRouteByRole(loginResponse.user.role, true);
      router.replace(target);
    } catch (err: any) {
      showAlert("Error", err.message);
    }
  };

  return (
    <AuthScreenShell maxWidth={440}>
      <AuthBranding
        title="Vet Clinic"
        subtitle="Create your account to book visits and manage pet records."
      />
      <RegistrationForm
        loading={loading}
        onSubmit={handleRegister}
        onLoginPress={() => router.push("/(auth)/login")}
      />
    </AuthScreenShell>
  );
}
