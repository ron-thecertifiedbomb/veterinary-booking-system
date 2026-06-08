import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
    Platform,
} from "react-native";
import { router } from "expo-router";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import { addPetSchema } from "@/features/pet/schemas/addPet.schema";
import { z } from "zod";
import { useAddPet } from "@/features/pet/hooks/useAddPet";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { BackButton } from "../BackButton/BackButton";

type CreatePetPayload = z.infer<typeof addPetSchema>;
type AddPetErrors = Partial<
    Record<keyof CreatePetPayload, string | null>
>;

export default function AddPetForm() {
    const { addPet, loading } = useAddPet();

    const [form, setForm] = useState<CreatePetPayload>({
        petName: "",
        species: "",
        breed: "",
        weight: "",
    });

    const [errors, setErrors] = useState<AddPetErrors>({});

    // ✅ sanitize number input
    const sanitizeNumber = (text: string) => {
        return text
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");
    };

    // ✅ LIVE VALIDATION
    const updateField = (
        key: keyof CreatePetPayload,
        value: string
    ) => {
        const newForm = { ...form, [key]: value };
        setForm(newForm);

        const result = addPetSchema.safeParse(newForm);

        if (!result.success) {
            const fieldErrors =
                result.error.flatten().fieldErrors;

            setErrors((prev) => ({
                ...prev,
                [key]: fieldErrors[key]?.[0] ?? null,
            }));
        } else {
            setErrors((prev) => ({
                ...prev,
                [key]: null,
            }));
        }
    };

    // ✅ SUBMIT
    const handleCreatePet = async () => {
        const result = addPetSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors =
                result.error.flatten().fieldErrors;

            setErrors({
                petName: fieldErrors.petName?.[0] ?? null,
                species: fieldErrors.species?.[0] ?? null,
                breed: fieldErrors.breed?.[0] ?? null,
                weight: fieldErrors.weight?.[0] ?? null,
            });

            return;
        }

        try {
            const { petName, species, breed, weight } =
                result.data;

            const response = await addPet({
                petName,
                species,
                breed: breed || "N/A",
                weight: Number(weight),
            });

            if (!response) return;

            showAlert("Success", response.message, () => {
                router.replace(
                    Platform.OS === "web"
                        ? "/(web)/web-pets"
                        : "(app)/(tabs)/pets"
                );
            });

            // ✅ RESET
            setForm({
                petName: "",
                species: "",
                breed: "",
                weight: "",
            });
        } catch (err: any) {
            showAlert("Error", err?.message);
        }
    };

    const isDisabled =
        !form.petName || !form.species || loading;

    return (
        <View className="flex-1 max-w-md bg-white px-6 pt-6">
            {/* ✅ HEADER */}
            <View className="mb-6">
                {/* ✅ BACK BUTTON */}

                <BackButton webRoute="/(web)/web-pets" appRoute="(app)/(tabs)/pets" /> 
      
                {/* ✅ TITLE */}
                <View className="items-center">
                    <Text className="text-3xl font-bold text-gray-900">
                        Add a Pet
                    </Text>

                    <Text className="text-sm text-gray-500 mt-2 text-center px-4">
                        Enter your pet’s details to start booking
                        appointments.
                    </Text>
                </View>

                {/* ✅ DIVIDER */}
                <View className="border-b border-gray-100 mt-6" />
            </View>

            {/* ✅ CARD */}
            <View className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                <View className="gap-4">
                    <AppTextInput
                        label="Pet Name"
                        value={form.petName}
                        onChangeText={(text) =>
                            updateField("petName", text)
                        }
                        placeholder="Duff"
                        error={errors.petName}
                    />

                    <AppTextInput
                        label="Species"
                        value={form.species}
                        onChangeText={(text) =>
                            updateField("species", text)
                        }
                        placeholder="Dog, Cat"
                        error={errors.species}
                    />

                    <AppTextInput
                        label="Breed (optional)"
                        value={form.breed ?? ""}
                        onChangeText={(text) =>
                            updateField("breed", text)
                        }
                        placeholder="Labrador"
                        error={errors.breed}
                    />

                    <AppTextInput
                        label="Weight (kg)"
                        value={form.weight ?? ""}
                        onChangeText={(text) =>
                            updateField(
                                "weight",
                                sanitizeNumber(text)
                            )
                        }
                        placeholder="12.5"
                        error={errors.weight}
                    />

                    {/* ✅ BUTTON */}
                    <Pressable
                        onPress={handleCreatePet}
                        disabled={isDisabled}
                        style={({ pressed }) => ({
                            marginTop: 16,
                            borderRadius: 14,
                            paddingVertical: 16,
                            alignItems: "center",
                            backgroundColor: isDisabled
                                ? "#E5E7EB"
                                : pressed
                                ? "#111827"
                                : "#000000",
                            transform: [
                                { scale: pressed ? 0.97 : 1 },
                            ],
                        })}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text
                                style={{
                                    color: isDisabled
                                        ? "#9CA3AF"
                                        : "#FFFFFF",
                                    fontWeight: "600",
                                    fontSize: 16,
                                }}
                            >
                                Save Pet
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </View>
    );
}