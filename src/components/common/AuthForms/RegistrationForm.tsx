import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import FormCard from "@/components/ui/FormCard";
import FormFields from "@/components/ui/FormFields";
import FormFooterLink from "@/components/ui/FormFooterLink";
import FormSection from "@/components/ui/FormSection";
import { registerSchema } from "@/features/auth/schemas/register.schema";
import { colors } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";
import { z } from "zod";

type RegisterFormData = z.infer<typeof registerSchema>;
type RegisterErrors = Partial<Record<keyof RegisterFormData, string | null>>;

type Props = {
  loading?: boolean;
  onSubmit: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => void;
  onLoginPress?: () => void;
};

export default function RegistrationForm({ loading, onSubmit, onLoginPress }: Props) {
  const [form, setForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<RegisterErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const updateField = (key: keyof RegisterFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = () => {
    const result = registerSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0] || null,
        email: fieldErrors.email?.[0] || null,
        phone: fieldErrors.phone?.[0] || null,
        password: fieldErrors.password?.[0] || null,
        confirmPassword: fieldErrors.confirmPassword?.[0] || null,
      });
      return;
    }

    const { name, email, phone, password } = result.data;
    onSubmit({ name, email, phone, password });
  };

  return (
    <View className="w-full">
      <FormCard
        title="Create account"
        lead="Register to book appointments and manage your pets."
      >
        <FormFields>
          <FormSection title="Personal details">
            <AppTextInput
              label="Full name"
              value={form.name}
              onChangeText={(text) => updateField("name", text)}
              placeholder="Juan Dela Cruz"
              error={errors.name}
            />
            <AppTextInput
              label="Email"
              value={form.email}
              onChangeText={(text) => updateField("email", text)}
              placeholder="you@email.com"
              keyboardType="email-address"
              error={errors.email}
            />
            <AppTextInput
              label="Phone"
              value={form.phone}
              onChangeText={(text) => updateField("phone", text.replace(/\D/g, ""))}
              placeholder="09123456789"
              error={errors.phone}
            />
          </FormSection>

          <FormSection title="Security">
            <AppTextInput
              label="Password"
              value={form.password}
              onChangeText={(text) => updateField("password", text)}
              placeholder="At least 8 characters"
              secureTextEntry={!showPassword}
              error={errors.password}
              rightIcon={
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.text.muted}
                />
              }
              onRightIconPress={() => setShowPassword((p) => !p)}
            />
            <AppTextInput
              label="Confirm password"
              value={form.confirmPassword}
              onChangeText={(text) => updateField("confirmPassword", text)}
              placeholder="Retype password"
              secureTextEntry={!showConfirm}
              error={errors.confirmPassword}
              rightIcon={
                <Ionicons
                  name={showConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.text.muted}
                />
              }
              onRightIconPress={() => setShowConfirm((p) => !p)}
            />
          </FormSection>
        </FormFields>

        <View className="mt-8">
          <AppButton label="Create account" onPress={handleSubmit} loading={loading} />
        </View>
      </FormCard>

      <FormFooterLink
        prompt="Have an account?"
        actionLabel="Sign in"
        onPress={onLoginPress}
      />
    </View>
  );
}
