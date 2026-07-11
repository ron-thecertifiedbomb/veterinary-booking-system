import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import AppButton from "@/components/ui/AppButton";
import FormCard from "@/components/ui/FormCard";
import FormFields from "@/components/ui/FormFields";
import FormSection from "@/components/ui/FormSection";
import FormSelect from "@/components/ui/FormSelect";
import { staffSchema } from "@/features/admin/schemas/staffSchema";
import { StaffFormData } from "@/features/admin/types/admin.types";
import { StaffPosition } from "@/features/staff/types/staff.types";
import { colors } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View } from "react-native";

type StaffErrors = Partial<Record<keyof StaffFormData, string | null>>;

type Props = {
  loading?: boolean;
  onSubmit: (data: StaffFormData) => void;
};

const STAFF_POSITIONS: { label: string; value: StaffPosition }[] = [
  { label: "Veterinarian", value: "VETERINARIAN" },
  { label: "Vet technician", value: "VET_TECHNICIAN" },
  { label: "Groomer", value: "GROOMER" },
];

export default function AddStaffForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<StaffFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
    position: "VETERINARIAN",
    specialization: "",
    licenseNumber: "",
  });

  const [errors, setErrors] = useState<StaffErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const updateField = <K extends keyof StaffFormData>(key: K, value: StaffFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handlePositionChange = (value: StaffPosition) => {
    updateField("position", value);

    if (value === "VETERINARIAN") {
      updateField("specialization", "Small Animals");
    }
  };

  const handleSubmit = () => {
    const cleanedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
    };

    const result = staffSchema.safeParse(cleanedForm);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const formattedErrors = Object.keys(fieldErrors).reduce((acc, key) => {
        acc[key as keyof StaffFormData] =
          fieldErrors[key as keyof StaffFormData]?.[0] || null;
        return acc;
      }, {} as StaffErrors);

      setErrors(formattedErrors);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <FormCard embedded compact title="Add staff member" lead="Create a clinic staff account with role details.">
      <FormFields>
        <FormSection title="Account">
          <AppTextInput
            label="Full name"
            value={form.name}
            onChangeText={(text) => updateField("name", text)}
            placeholder="Dr. Ana Reyes"
            error={errors.name}
          />
          <AppTextInput
            label="Email"
            value={form.email}
            onChangeText={(text) => updateField("email", text)}
            placeholder="staff@vetclinic.com"
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

        <FormSection title="Professional details">
          <FormSelect
            label="Position"
            value={form.position}
            onValueChange={handlePositionChange}
            options={STAFF_POSITIONS}
            error={errors.position}
          />
          <AppTextInput
            label="Specialization"
            value={form.specialization}
            onChangeText={(text) => updateField("specialization", text)}
            placeholder="Small Animals"
            error={errors.specialization}
          />
          <AppTextInput
            label="License number"
            value={form.licenseNumber}
            onChangeText={(text) => updateField("licenseNumber", text)}
            placeholder="VET-12345"
            error={errors.licenseNumber}
          />
        </FormSection>
      </FormFields>

      <View className="mt-8">
        <AppButton label="Add staff member" onPress={handleSubmit} loading={loading} />
      </View>
    </FormCard>
  );
}
