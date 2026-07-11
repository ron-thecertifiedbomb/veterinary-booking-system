import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import FormCard from "@/components/ui/FormCard";
import FormFields from "@/components/ui/FormFields";
import FormFooterLink from "@/components/ui/FormFooterLink";
import { loginSchema } from "@/features/auth/schemas/login.schema";
import { colors } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";

type LoginFormProps = {
  loading?: boolean;
  onSubmit: (data: { email: string; password: string }) => void;
  onRegisterPress?: () => void;
};

export default function LoginForm({ loading, onSubmit, onRegisterPress }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleSubmit = () => {
    setEmailError(null);
    setPasswordError(null);

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      if (errors.email) setEmailError(errors.email[0]);
      if (errors.password) setPasswordError(errors.password[0]);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <View className="w-full">
      <FormCard title="Welcome back" lead="Enter your account details below.">
        <FormFields>
          <AppTextInput
            label="Email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(null);
            }}
            placeholder="you@email.com"
            keyboardType="email-address"
            error={emailError}
          />

          <AppTextInput
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setPasswordError(null);
            }}
            placeholder="Enter password"
            secureTextEntry={!isPasswordVisible}
            error={passwordError}
            rightIcon={
              <Ionicons
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.text.muted}
              />
            }
            onRightIconPress={() => setIsPasswordVisible((prev) => !prev)}
          />
        </FormFields>

        <View className="mt-8">
          <AppButton label="Sign in" onPress={handleSubmit} loading={loading} />
        </View>
      </FormCard>

      <FormFooterLink
        prompt="No account?"
        actionLabel="Create one"
        onPress={onRegisterPress}
      />
    </View>
  );
}
