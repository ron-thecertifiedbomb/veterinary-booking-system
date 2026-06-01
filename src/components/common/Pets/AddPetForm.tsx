import { useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    Text,
    View,
} from "react-native";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import { addPetSchema } from "@/features/pet/schemas/addPet.schema";
import { z } from "zod";
import { CreatePetPayload } from "@/features/pet/types";

type AddPetFormData = z.infer<typeof addPetSchema>;
type AddPetErrors = Partial<
    Record<keyof AddPetFormData, string | null>
>;

type Props = {
    loading?: boolean;
    onSubmit: (data: CreatePetPayload) => void;
};

export default function AddPetForm({ loading, onSubmit }: Props) {
    const [form, setForm] = useState<AddPetFormData>({
        petName: "",
        species: "",
        breed: "",
        weight: "",
    });

    const [errors, setErrors] = useState<AddPetErrors>({});

    // ✅ Better number sanitizer
    const sanitizeNumber = (text: string) => {
        return text
            .replace(/[^0-9.]/g, "")
            .replace(/(\..*)\./g, "$1");
    };

    // ✅ LIVE VALIDATION
    const updateField = (key: keyof AddPetFormData, value: string) => {
        const newForm = { ...form, [key]: value };
        setForm(newForm);

        const result = addPetSchema.safeParse(newForm);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

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

    const handleSubmit = () => {
        const result = addPetSchema.safeParse(form);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                petName: fieldErrors.petName?.[0] ?? null,
                species: fieldErrors.species?.[0] ?? null,
                breed: fieldErrors.breed?.[0] ?? null,
                weight: fieldErrors.weight?.[0] ?? null,
            });

            return;
        }

        const { petName, species, breed, weight } = result.data;

        onSubmit({
            petName,
            species,
            breed: breed === "" ? "N/A" : breed,
            weight: Number(weight),
        });

        // ✅ RESET AFTER SUBMIT
        setForm({
            petName: "",
            species: "",
            breed: "",
            weight: "",
        });
    };

    const isDisabled =
        !form.petName || !form.species || loading;

    return (
        <View className="w-full max-w-xl px-4">

            {/* ✅ CARD CONTAINER */}
            <View
                className="bg-white rounded-3xl px-6 py-8"
                style={{
                    boxShadow: "0px 8px 24px rgba(15,23,42,0.08)",
                }}
            >

                {/* ✅ HEADER */}
                <View className="mb-6 items-center">
                    <Text className="text-3xl font-bold tracking-tight text-text-primary">
                        Add a Pet
                    </Text>

                    <Text className="text-sm text-text-secondary mt-2 text-center leading-relaxed">
                        Enter your pet’s details to start booking appointments.
                    </Text>
                </View>

                {/* ✅ DIVIDER */}
                <View className="h-[1px] bg-gray-200 mb-4" />

                {/* ✅ FORM */}
                <View className="gap-4">

                    <AppTextInput
                        label="Pet Name"
                        value={form.petName}
                        onChangeText={(text) =>
                            updateField("petName", text)
                        }
                        placeholder="e.g. Duff"
                        error={errors.petName}
                    />

                    <AppTextInput
                        label="Species"
                        value={form.species}
                        onChangeText={(text) =>
                            updateField("species", text)
                        }
                        placeholder="Dog, Cat, etc."
                        error={errors.species}
                    />

                    <AppTextInput
                        label="Breed (optional)"
                        value={form.breed ?? ""}
                        onChangeText={(text) =>
                            updateField("breed", text)
                        }
                        placeholder="e.g. Labrador"
                        error={errors.breed}
                    />

                    <AppTextInput
                        label="Weight (kg)"
                        value={form.weight ?? ""}
                        onChangeText={(text) =>
                            updateField("weight", sanitizeNumber(text))
                        }
                        placeholder="e.g. 12.5"
                        error={errors.weight}
                    />

                    {/* ✅ BUTTON */}
                    <Pressable
                        onPress={handleSubmit}
                        disabled={isDisabled}
                        style={({ pressed }) => ({
                            marginTop: 20,
                            borderRadius: 18,
                            paddingVertical: 16,
                            alignItems: "center",

                            backgroundColor: isDisabled
                                ? "#E5E7EB"
                                : pressed
                                    ? "#0F172A"
                                    : "#020617",

                            transform: [{ scale: pressed ? 0.97 : 1 }],
                        })}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text
                                style={{
                                    color: isDisabled ? "#9CA3AF" : "#FFFFFF",
                                    fontWeight: "600",
                                    fontSize: 16,
                                    letterSpacing: -0.2,
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
``