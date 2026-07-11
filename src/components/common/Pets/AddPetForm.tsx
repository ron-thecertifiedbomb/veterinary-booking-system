import Panel from "@/components/layout/Panel";
import AppButton from "@/components/ui/AppButton";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import { BackButton } from "@/components/common/BackButton/BackButton";
import { addPetSchema } from "@/features/pet/schemas/addPet.schema";
import { useAddPet } from "@/features/pet/hooks/useAddPet";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { router } from "expo-router";
import { useState } from "react";
import { Platform, View } from "react-native";
import { z } from "zod";

type CreatePetPayload = z.infer<typeof addPetSchema>;
type AddPetErrors = Partial<Record<keyof CreatePetPayload, string | null>>;

export default function AddPetForm() {
  const { addPet, loading } = useAddPet();

  const [form, setForm] = useState<CreatePetPayload>({
    petName: "",
    species: "",
    breed: "",
    weight: "",
  });
  const [errors, setErrors] = useState<AddPetErrors>({});

  const sanitizeNumber = (text: string) =>
    text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

  const updateField = (key: keyof CreatePetPayload, value: string) => {
    const newForm = { ...form, [key]: value };
    setForm(newForm);
    const result = addPetSchema.safeParse(newForm);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors((prev) => ({ ...prev, [key]: fieldErrors[key]?.[0] ?? null }));
    } else {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleCreatePet = async () => {
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

    try {
      const { petName, species, breed, weight } = result.data;
      const response = await addPet({
        petName,
        species,
        breed: breed || "N/A",
        weight: weight ? Math.round(Number(weight) * 100) : 0,
      });
      if (!response) return;

      showAlert("Success", response.message, () => {
        router.replace(
          Platform.OS === "web" ? "/(web)/web-pets" : "/(app)/(tabs)/pets",
        );
      });
    } catch (err: any) {
      showAlert("Error", err?.message);
    }
  };

  return (
    <View className="flex-1 max-w-md w-full self-center">
      <BackButton webRoute="/(web)/web-pets" appRoute="/(app)/(tabs)/pets" />

      <HeaderSection
        title="Add a pet"
        description="Register your pet to start booking clinic visits."
      />

      <Panel>
        <View className="gap-4">
        <AppTextInput
          label="Pet name"
          value={form.petName}
          onChangeText={(text) => updateField("petName", text)}
          placeholder="e.g. Buddy"
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
          placeholder="Labrador"
          error={errors.breed}
        />
        <AppTextInput
          label="Weight (kg)"
          value={form.weight ?? ""}
          onChangeText={(text) => updateField("weight", sanitizeNumber(text))}
          placeholder="12.5"
          error={errors.weight}
        />

        <AppButton
          label="Save pet"
          onPress={handleCreatePet}
          loading={loading}
          disabled={!form.petName || !form.species}
        />
        </View>
      </Panel>
    </View>
  );
}
