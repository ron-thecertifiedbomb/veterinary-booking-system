import { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
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

    const updateField = (key: keyof AddPetFormData, value: string) => {
        setForm((prev) => ({ ...prev, [key]: value }));
        setErrors((prev) => ({ ...prev, [key]: null }));
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
            breed: breed === "" ?  "n/a" : breed,
            weight: Number(weight)
        });
    };


    const isDisabled = !form.petName || !form.species || loading;

    return (
        <View className="w-full max-w-xl px-6 py-8">

            {/* HEADER */}
            <View className="mb-8 items-center">
                <Text className="text-3xl font-semibold text-text-primary">
                    Add a Pet
                </Text>
                <Text className="text-sm text-text-secondary mt-1 text-center">
                    Enter your pet’s details for booking appointments.
                </Text>
            </View>

            <View className="gap-4">

                <AppTextInput
                    label="Pet Name"
                    value={form.petName}
                    onChangeText={(text) => updateField("petName", text)}
                    placeholder="e.g. Duff"
                    error={errors.petName}
                />

                <AppTextInput
                    label="Species"
                    value={form.species}
                    onChangeText={(text) => updateField("species", text)}
                    placeholder="Dog, Cat, etc."
                    error={errors.species}
                />

                <AppTextInput
                    label="Breed (optional)"
                    value={form.breed ?? ""}
                    onChangeText={(text) => updateField("breed", text)}
                    placeholder="e.g. Labrador"
                    error={errors.breed}
                />

                <AppTextInput
                    label="Weight (kg)"
                    value={form.weight ?? ""}
                    onChangeText={(text) =>
                        updateField("weight", text.replace(/[^0-9.]/g, ""))
                    }
                    placeholder="e.g. 12.5"
                    error={errors.weight}
                />

                <Pressable
                    onPress={handleSubmit}
                    disabled={isDisabled}
                    className={`rounded-2xl py-4 items-center mt-6 ${isDisabled ? "bg-gray-300" : "bg-black"
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text
                            className={`font-semibold ${isDisabled ? "text-gray-500" : "text-white"
                                }`}
                        >
                            Save Pet
                        </Text>
                    )}
                </Pressable>

            </View>
        </View>
    );
}