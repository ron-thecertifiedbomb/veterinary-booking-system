import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import FormCard from "@/components/ui/FormCard";
import FormFields from "@/components/ui/FormFields";
import FormSection from "@/components/ui/FormSection";
import FormSelect from "@/components/ui/FormSelect";
import { adminSchema } from "@/features/admin/schemas/adminSchema";
import { AdminFormData, AdminPosition } from "@/features/admin/types/admin.types";
import { colors } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";

type AdminErrors = Partial<Record<keyof AdminFormData, string | null>>;

type Props = {
  loading?: boolean;
  onSubmit: (data: AdminFormData) => void;
};

const ADMIN_POSITIONS: { label: string; value: AdminPosition }[] = [
  { label: "Manager", value: "MANAGER" },
  { label: "Accountant", value: "ACCOUNTANT" },
  { label: "Receptionist", value: "RECEPTIONIST" },
];

export default function AddAdminForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<AdminFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    position: "MANAGER",
    department: "",
  });

  const [errors, setErrors] = useState<AdminErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const updateField = <K extends keyof AdminFormData>(key: K, value: AdminFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handlePositionChange = (value: AdminPosition) => {
    updateField("position", value);

    if (value === "MANAGER") {
      updateField("department", "Operations");
    } else if (value === "ACCOUNTANT") {
      updateField("department", "Finance");
    } else if (value === "RECEPTIONIST") {
      updateField("department", "Front Desk");
    }
  };

  const handleSubmit = () => {
    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    };

    const result = adminSchema.safeParse(cleanedForm);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const formattedErrors = Object.keys(fieldErrors).reduce((acc, key) => {
        acc[key as keyof AdminFormData] =
          fieldErrors[key as keyof AdminFormData]?.[0] || null;
        return acc;
      }, {} as AdminErrors);

      setErrors(formattedErrors);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <FormCard
      embedded
      compact
      title="Add administrator"
      lead="Create a new admin account for clinic operations."
    >
      <FormFields>
        <FormSection title="Account">
          <AppTextInput
            label="Full name"
            value={form.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder="Maria Santos"
            error={errors.name}
          />
          <AppTextInput
            label="Email"
            value={form.email}
            onChangeText={(text) => updateField("email", text)}
            placeholder="admin@vetclinic.com"
            keyboardType="email-address"
            error={errors.email}
          />
          <AppTextInput
            label="Phone"
            value={form.phone}
            onChangeText={(text) =>
              updateField("phone", text.replace(/\D/g, "").slice(0, 11))
            }
            placeholder="09123456789"
            error={errors.phone}
          />
          <AppTextInput
            label="Password"
            value={form.password}
            onChangeText={(text) => updateField("password", text)}
            placeholder="Temporary password"
            secureTextEntry={!showPassword}
            error={errors.password}
            rightIcon={
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={colors.text.muted}
              />
            }
            onRightIconPress={() => setShowPassword((prev) => !prev)}
          />
        </FormSection>

        <FormSection title="Role">
          <FormSelect
            label="Position"
            value={form.position}
            onValueChange={handlePositionChange}
            options={ADMIN_POSITIONS}
            error={errors.position}
          />
          <AppTextInput
            label="Department"
            value={form.department}
            onChangeText={(text) => updateField("department", text)}
            placeholder="e.g. Operations"
            error={errors.department}
          />
        </FormSection>
      </FormFields>

      <View className="mt-8">
        <AppButton label="Add administrator" onPress={handleSubmit} loading={loading} />
      </View>
    </FormCard>
  );
}
