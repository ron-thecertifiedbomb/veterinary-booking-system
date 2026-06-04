import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import { registerSchema } from "@/features/auth/schemas/register.schema";
import { z } from "zod";

// ✅ infer type from schema (BIG UPGRADE)
type RegisterFormData = z.infer<typeof registerSchema>;

// ✅ error type aligned with fields
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

export default function RegisterForm({
    loading,
    onSubmit,
    onLoginPress,
}: Props) {
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

        // ✅ destructure only needed fields
        const { name, email, phone, password } = result.data;

        onSubmit({ name, email, phone, password });
    };

    return (
        <View className="w-full max-w-md px-6 py-8">

            {/* HEADER */}
            <View className="mb-8 items-center">
                <Text className="text-3xl font-semibold text-text-primary">
                    Create an Account
                </Text>
                <Text className="text-xs text-text-secondary mt-1">
                    Register to start booking appointments for your pets.
                </Text>
            </View>

     

                <AppTextInput
                    label="Name"
                    value={form.name}
                    onChangeText={(text) => updateField("name", text)}
                    placeholder="Full name"
                    error={errors.name}
                />

                <AppTextInput
                    label="Email"
                    value={form.email}
                    onChangeText={(text) => updateField("email", text)}
                    placeholder="Email address"
                    keyboardType="email-address"
                    error={errors.email}
                />

                <AppTextInput
                    label="Phone"
                    value={form.phone}
                    onChangeText={(text) =>
                        updateField("phone", text.replace(/\D/g, ""))
                    }
                    placeholder="Contact number"
                    error={errors.phone}
                />

                <AppTextInput
                    label="Password"
                    value={form.password}
                    onChangeText={(text) => updateField("password", text)}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    error={errors.password}
                    rightIcon={
                        <Ionicons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#6b7280"
                        />
                    }
                    onRightIconPress={() => setShowPassword((p) => !p)}
                />

                <AppTextInput
                    label="Confirm Password"
                    value={form.confirmPassword}
                    onChangeText={(text) =>
                        updateField("confirmPassword", text)
                    }
                    placeholder="Retype your password"
                    secureTextEntry={!showConfirm}
                    error={errors.confirmPassword}
                    rightIcon={
                        <Ionicons
                            name={showConfirm ? "eye-off-outline" : "eye-outline"}
                            size={22}
                            color="#6b7280"
                        />
                    }
                    onRightIconPress={() => setShowConfirm((p) => !p)}
                />

                <Pressable
                    onPress={handleSubmit}
                    disabled={loading}
                    className="bg-black rounded-2xl py-4 items-center mt-6"
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text className="text-white font-semibold">
                            Create Account
                        </Text>
                    )}
                </Pressable>

                <View className="mt-2 items-center">
                    <Text className="text-sm text-text-secondary">
                        Already have an account?
                    </Text>
                    <Pressable onPress={onLoginPress}>
                        <Text className="text-sm font-semibold text-secondary mt-1">
                            Sign in here
                        </Text>
                    </Pressable>
                </View>

            </View>
       
    );
}