import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";


import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import { adminSchema } from "@/features/admin/schemas/adminSchema";
import { AdminFormData, AdminPosition } from "@/features/admin/types/admin.types";
import { Picker } from "@react-native-picker/picker";

/* ---------------- TYPES ---------------- */


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


/* ---------------- COMPONENT ---------------- */

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

    /* ✅ FIXED typed update */
    const updateField = <K extends keyof AdminFormData>(
        key: K,
        value: AdminFormData[K]
    ) => {
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

            const formattedErrors = Object.keys(fieldErrors).reduce(
                (acc, key) => {
                    acc[key as keyof AdminFormData] =
                        fieldErrors[key as keyof AdminFormData]?.[0] || null;
                    return acc;
                },
                {} as AdminErrors
            );

            setErrors(formattedErrors);
            return;
        }

        onSubmit(result.data);
    };

    return (
        <View className="w-full px-6 py-4">


            <AppTextInput
                label="Full Name"
                value={form.name}
                onChangeText={(text) => updateField("name", text)}
                error={errors.name}
            />

            <AppTextInput
                label="Email"
                value={form.email}
                onChangeText={(text) => updateField("email", text)}
                keyboardType="email-address"
                error={errors.email}
            />

            <AppTextInput
                label="Phone"
                value={form.phone}
                onChangeText={(text) =>
                    updateField("phone", text.replace(/\D/g, "").slice(0, 11))
                }
                error={errors.phone}
            />

            <AppTextInput
                label="Password"
                value={form.password}
                onChangeText={(text) => updateField("password", text)}
                secureTextEntry
                error={errors.password}
            />

            <View className="mb-2">
                <Text className="text-xs lg:text-xs font-medium text-text-primary mb-1">
                    Position
                </Text>

                <View className="border border-slate-200 rounded-xl bg-white px-1 py-2">
                    <Picker
                        selectedValue={form.position}
                        onValueChange={(value) =>
                            handlePositionChange(value as AdminPosition)
                        }

                    >
                        {ADMIN_POSITIONS.map((pos) => (
                            <Picker.Item
                                key={pos.value}
                                label={pos.label}
                                value={pos.value}
                            />
                        ))}
                    </Picker>
                </View>

                {errors.position && (
                    <Text className="text-red-500 text-xs mt-1">
                        {errors.position}
                    </Text>
                )}
            </View>

            <AppTextInput
                label="Department"
                value={form.department}
                onChangeText={(text) =>
                    updateField("department", text)
                }
                placeholder="e.g. Operations"
                error={errors.department}
            />

            {/* Submit */}
            <Pressable
                onPress={handleSubmit}
                disabled={loading}
                className={`rounded-2xl py-3 items-center mt-4 ${loading ? "bg-gray-300" : "bg-black active:opacity-80"
                    }`}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text className="text-white font-semibold">
                        Add Admin
                    </Text>
                )}
            </Pressable>
        </View>
    );
}