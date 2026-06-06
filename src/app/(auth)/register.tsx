import AppSafeArea from "@/components/common/AppSafeArea/AppSafeArea";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { RegisterPayload } from "@/features/auth/types/auth.registration";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  Animated,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import AnimatedSlide from "@/components/common/AnimatedSlide/AnimatedSlide";
import RegistrationForm from "@/components/common/AuthForms/RegistrationForm";


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
    <AppSafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center items-center px-8"
      >
        <AnimatedSlide>
          <View className="w-full items-center">
            <RegistrationForm
              loading={loading}
              onSubmit={handleRegister}
              onLoginPress={() => router.push("/(auth)/login")}
            />
          </View>
        </AnimatedSlide>
      </KeyboardAvoidingView>
    </AppSafeArea>
  );
}
