import React, { useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { z } from "zod";

import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import { staffSchema } from "@/features/admin/schemas/staffSchema";
import { StaffPosition } from "@/features/auth/types/auth.user";

/* ---------------- TYPES ---------------- */

type StaffFormData = z.infer<typeof staffSchema>;
type StaffErrors = Partial<Record<keyof StaffFormData, string | null>>;

type Props = {
    loading?: boolean;
    onSubmit: (data: StaffFormData) => void;
};

/* ---------------- CONSTANTS ---------------- */

const STAFF_POSITIONS: { label: string; value: StaffPosition }[] = [
    { label: "Veterinarian", value: "VETERINARIAN" },
    { label: "Vet Technician", value: "VET_TECHNICIAN" },
    { label: "Groomer", value: "GROOMER" },
];

/* ---------------- COMPONENT ---------------- */

export default function AddStaffForm({ loading, onSubmit }: Props) {
    const [form, setForm] = useState<StaffFormData>({
        email: "",
        password: "",
        name: "",
        phone: "",
        position: "VETERINARIAN", // default
        specialization: "",
        licenseNumber: "",
    });

    const [errors, setErrors] = useState<StaffErrors>({});

    // ✅ FIXED (important bug fixed here)
    const updateField = <K extends keyof StaffFormData>(
        key: K,
        value: StaffFormData[K]
    ) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: null }));
    };

    const handleSubmit = () => {
        // ✅ clean inputs
        const cleanedForm = {
            ...form,
            name: form.name.trim(),
            email: form.email.trim(),
        };

        const result = staffSchema.safeParse(cleanedForm);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            const formattedErrors = Object.keys(fieldErrors).reduce(
                (acc, key) => {
                    acc[key as keyof StaffFormData] =
                        fieldErrors[key as keyof StaffFormData]?.[0] || null;
                    return acc;
                },
                {} as StaffErrors
            );

            setErrors(formattedErrors);
            return;
        }

        onSubmit(result.data);
    };

    // ✅ Optional smart UX
    const handlePositionChange = (value: StaffPosition) => {
        updateField("position", value);

        if (value === "VETERINARIAN") {
            updateField("specialization", "Small Animals");
        }
    };

    return (
        <View className="w-full space-y-3">
            {/* Title */}
            <Text className="text-xl font-semibold mb-2">
                Add Staff
            </Text>

            {/* Name */}
            <AppTextInput
                label="Full Name"
                value={form.name}
                onChangeText={(text) => updateField("name", text)}
                error={errors.name}
            />

            {/* Email */}
            <AppTextInput
                label="Email"
                value={form.email}
                onChangeText={(text) => updateField("email", text)}
                keyboardType="email-address"
                error={errors.email}
            />

            {/* Phone */}
            <AppTextInput
                label="Phone"
                value={form.phone}
                onChangeText={(text) =>
                    updateField("phone", text.replace(/\D/g, "").slice(0, 11))
                }
                error={errors.phone}
            />

            {/* Password */}
            <AppTextInput
                label="Password"
                value={form.password}
                onChangeText={(text) => updateField("password", text)}
                secureTextEntry
                error={errors.password}
            />

            {/* ✅ Position Dropdown */}
            <View className="mb-2">
                <Text className="text-sm text-slate-600 mb-1">
                    Position
                </Text>

                <View className="border border-slate-200 rounded-xl bg-white px-1">
                    <Picker
                        selectedValue={form.position}
                        onValueChange={(value) =>
                            handlePositionChange(value as StaffPosition)
                        }
                    >
                        {STAFF_POSITIONS.map((pos) => (
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

            {/* Specialization */}
            <AppTextInput
                label="Specialization"
                value={form.specialization}
                onChangeText={(text) =>
                    updateField("specialization", text)
                }
                error={errors.specialization}
            />

            {/* License */}
            <AppTextInput
                label="License Number"
                value={form.licenseNumber}
                onChangeText={(text) =>
                    updateField("licenseNumber", text)
                }
                error={errors.licenseNumber}
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
                        Add Staff
                    </Text>
                )}
            </Pressable>
        </View>
    );
}