import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import Loader from "@/components/common/Loader/Loader";

import { useUpdateProfile } from "@/features/users/hook/UpdateProfile";
import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import { showAlert } from "@/hooks/crossPlatformAlert";

import { z } from "zod";
import { BackButton } from "../BackButton/BackButton";

// ✅ ZOD SCHEMA
const editProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z.string().optional(),
});

type FormData = z.infer<typeof editProfileSchema>;
type Errors = Partial<Record<keyof FormData, string | null>>;

export default function EditProfileForm() {
    const router = useRouter();

    const { updateProfile, loading } = useUpdateProfile();
    const { profile, fetchUserProfile, loading: fetching } =
        useGetUserProfile();

    const [form, setForm] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
    });

    const [original, setOriginal] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        fetchUserProfile();
    }, []);

    useEffect(() => {
        if (!profile) return;

        const data = {
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
        };

        setForm(data);
        setOriginal(data);
    }, [profile]);

    const updateField = (key: keyof FormData, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: null }));
    };

    const hasChanges =
        form.name !== original.name ||
        form.email !== original.email ||
        form.phone !== original.phone;

    const isDisabled =
        !form.name || !form.email || !hasChanges || loading;

    // ✅ ZOD VALIDATION
    const handleSubmit = async () => {
        const result = editProfileSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                name: fieldErrors.name?.[0] || null,
                email: fieldErrors.email?.[0] || null,
                phone: fieldErrors.phone?.[0] || null,
            });

            return;
        }

        const res = await updateProfile(result.data);

        if (!res) {
            showAlert("Error", "Failed to update profile");
            return;
        }

        showAlert("Success", res.message, () => {

            router.replace(
                Platform.OS === "web"
                    ? "/(web)/web-profile"
                    : "(app)/(tabs)/profile"
            );

        });
    };

    if (fetching) return <Loader fullScreen />;

    return (
        <View className="flex-1 max-w-md bg-white px-6 pt-6">
     <BackButton webRoute="/(web)/web-profile" appRoute="(app)/(tabs)/profile" /> 
            {/* HEADER */}
            <View className="mb-10 items-center">
                <Text className="text-3xl font-bold text-gray-900">
                    Edit Profile
                </Text>
                <Text className="text-sm text-gray-500 mt-2 text-center">
                    Update your personal information
                </Text>
            </View>

            {/* CARD */}
            <View className="bg-white rounded-3xl p-5 shadow-sm">

                <View className="mb-5">
                    <AppTextInput
                        label="Full Name"
                        value={form.name}
                        onChangeText={(text) => updateField("name", text)}
                        placeholder="John Doe"
                        error={errors.name}
                    />
                </View>

                <View className="mb-5">
                    <AppTextInput
                        label="Email Address"
                        value={form.email}
                        onChangeText={(text) => updateField("email", text)}
                        placeholder="john@email.com"
                        keyboardType="email-address"
                        error={errors.email}
                    />
                </View>

                <View className="mb-6">
                    <AppTextInput
                        label="Phone (Optional)"
                        value={form.phone ?? ""}
                        onChangeText={(text) =>
                            updateField("phone", text.replace(/\D/g, ""))
                        }
                        placeholder="09123456789"
                        error={errors.phone}
                    />
                </View>

                <Pressable
                    onPress={handleSubmit}
                    disabled={isDisabled}
                    className={`rounded-xl py-4 items-center ${isDisabled
                            ? "bg-gray-300"
                            : "bg-black active:opacity-80"
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            className={`font-semibold text-base ${isDisabled ? "text-gray-500" : "text-white"
                                }`}
                        >
                            Save Changes
                        </Text>
                    )}
                </Pressable>
            </View>
        </View>
    );
}