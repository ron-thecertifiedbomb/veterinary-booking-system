import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import Loader from "@/components/common/Loader/Loader";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, Text, View } from "react-native";
import { z } from "zod";
import { BackButton } from "../BackButton/BackButton";
import { useUpdateProfile } from "@/features/users/hook/useUpdateProfile";
import { useGetProfile } from "@/features/users/hook/useGetProfile";

// ✅ ZOD SCHEMA FIX: Made phone optional to match your UI label
const editProfileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().optional(), 
});

type FormData = z.infer<typeof editProfileSchema>;
type Errors = Partial<Record<keyof FormData, string | null>>;

export default function EditProfileForm() {
    const { profile, fetchProfile, loading: fetching } = useGetProfile();
    const { updateProfile, loading } = useUpdateProfile();

    const router = useRouter();

    const [form, setForm] = useState<FormData>({
        name: "",
        phone: "",
    });

    const [original, setOriginal] = useState<FormData>({
        name: "",
        phone: "",
    });

    const [errors, setErrors] = useState<Errors>({});

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (!profile) return;

        const data = {
            name: profile.name || "",
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
        form.name !== original.name || form.phone !== original.phone;

    const isDisabled = !form.name || !hasChanges || loading;

    // ✅ ZOD VALIDATION IMPLEMENTED
    const handleSubmit = async () => {
        // 1. Run the safeParse against your form state
        const validation = editProfileSchema.safeParse(form);

        if (!validation.success) {
            const formattedErrors: Errors = {};
            validation.error.issues.forEach((issue) => {
                const key = issue.path[0] as keyof FormData;
                formattedErrors[key] = issue.message;
            });
            setErrors(formattedErrors);
            return;
        }

        const payload = {
            name: validation.data.name,
            phone: validation.data.phone ?? "", // ✅ Fallback to an empty string if undefined
        };
        const res = await updateProfile(payload);
        if (!res) {
            showAlert("Error", "Failed to update profile");
            return;
        }
        showAlert("Success", res.message, () => {
            router.replace(
                Platform.OS === "web"
                    ? "/(web)/profile"
                    : "(app)/(tabs)/profile"
            );
        });
    };

    if (fetching) return <Loader fullScreen />;

    return (
        <View className="flex-1 max-w-md bg-white px-6 pt-6">
            <BackButton
                onPress={() => {
                    router.replace("/(web)/profile");
                }}
                className="mb-4 p-1"
            />

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
                    className={`rounded-xl py-4 items-center ${
                        isDisabled ? "bg-gray-300" : "bg-black active:opacity-80"
                    }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text
                            className={`font-semibold text-base ${
                                isDisabled ? "text-gray-500" : "text-white"
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