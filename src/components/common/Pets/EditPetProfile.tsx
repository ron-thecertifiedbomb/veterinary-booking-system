import { BackButton } from "@/components/common/BackButton/BackButton";
import AppTextInput from "@/components/common/AppTextInput/AppTextInput";
import Container from "@/components/common/Container/Container";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import AppButton from "@/components/ui/AppButton";
import SectionLabel from "@/components/ui/SectionLabel";
import { useGetPetProfile } from "@/features/pet/hooks/useGetPetProfile";
import { useUpdatePet } from "@/features/pet/hooks/useUpdatePet";
import { addPetSchema } from "@/features/pet/schemas/addPet.schema";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { colors, iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";

type PetFormData = z.infer<typeof addPetSchema>;
type PetFormErrors = Partial<Record<keyof PetFormData, string | null>>;

const SPECIES_OPTIONS = ["Dog", "Cat", "Bird", "Rabbit", "Other"];

function formatWeight(weight?: number) {
  if (!weight) return "—";
  return `${(weight / 100).toFixed(1)} kg`;
}

export default function EditPetProfile() {
  const { id: petId } = useLocalSearchParams<{ id?: string }>();
  const { pet, fetchPet, loading: fetching } = useGetPetProfile();
  const { updatePet, loading: saving } = useUpdatePet();
  const isWeb = Platform.OS === "web";

  const [form, setForm] = useState<PetFormData>({
    petName: "",
    species: "",
    breed: "",
    weight: "",
  });
  const [original, setOriginal] = useState<PetFormData>({
    petName: "",
    species: "",
    breed: "",
    weight: "",
  });
  const [errors, setErrors] = useState<PetFormErrors>({});

  useEffect(() => {
    if (petId) fetchPet(petId);
  }, [petId]);

  useEffect(() => {
    if (!pet) return;

    const data: PetFormData = {
      petName: pet.petName || "",
      species: pet.species || "",
      breed: pet.breed || "",
      weight: pet.weight ? String(pet.weight / 100) : "",
    };

    setForm(data);
    setOriginal(data);
  }, [pet]);

  const visitCount = pet?.appointmentIDs?.length ?? 0;

  const hasChanges = useMemo(
    () =>
      form.petName !== original.petName ||
      form.species !== original.species ||
      form.breed !== original.breed ||
      form.weight !== original.weight,
    [form, original],
  );

  const sanitizeNumber = (text: string) =>
    text.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");

  const updateField = (key: keyof PetFormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const handleSubmit = async () => {
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

    if (!petId) return;

    try {
      const { petName, species, breed, weight } = result.data;
      const response = await updatePet(petId, {
        petName,
        species,
        breed: breed || "N/A",
        weight: weight ? Math.round(Number(weight) * 100) : undefined,
      });

      if (!response) return;

      showAlert("Success", response.message, () => {
        router.replace(isWeb ? "/(web)/pets" : "/(app)/(tabs)/pets");
      });
    } catch (err: any) {
      showAlert("Error", err?.message || "Failed to update pet");
    }
  };

  const openVisit = (appointmentId: string) => {
    if (isWeb) {
      router.push(`/(web)/appointments/${appointmentId}`);
      return;
    }
    router.push(`/(app)/appointments/${appointmentId}`);
  };

  if (fetching && !pet) {
    return <Loader fullScreen />;
  }

  if (!pet) {
    return (
      <Container>
        <BackButton webRoute="/(web)/pets" appRoute="/(app)/(tabs)/pets" />
        <Panel wide title="Pet profile" lead="Pet record could not be loaded.">
          <Text className="text-sm text-text-secondary font-sans">
            This pet may have been removed or you may not have access.
          </Text>
        </Panel>
      </Container>
    );
  }

  return (
    <Container className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="mb-4">
          <BackButton webRoute="/(web)/pets" appRoute="/(app)/(tabs)/pets" />
        </View>

        <Panel wide title="Pet profile" lead="Update your pet's details and view visit history.">
          <View className="flex-row items-center gap-4 mb-6 pb-6 border-b border-border">
            <View className="w-14 h-14 rounded-xl bg-accent items-center justify-center">
              <Ionicons name="paw" size={iconSize.xl} color="#fff" />
            </View>
            <View className="flex-1 min-w-0">
              <Text className="text-pageTitle text-text-primary font-bold" numberOfLines={1}>
                {pet.petName}
              </Text>
              <Text className="text-sm text-text-secondary mt-1 font-sans">
                {[pet.species, pet.breed].filter(Boolean).join(" · ")}
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-6">
            <View className="px-3.5 py-2 rounded-lg bg-accent">
              <Text className="text-xs font-semibold text-text-inverse font-sans">
                {visitCount} {visitCount === 1 ? "visit" : "visits"}
              </Text>
            </View>
            <View className="px-3.5 py-2 rounded-lg bg-surfaceMuted border border-border">
              <Text className="text-xs font-medium text-text-secondary font-sans">
                Weight {formatWeight(pet.weight)}
              </Text>
            </View>
          </View>

          <View className="gap-5">
            <AppTextInput
              label="Pet name"
              value={form.petName}
              onChangeText={(text) => updateField("petName", text)}
              placeholder="e.g. Buddy"
              error={errors.petName}
            />

            <View>
              <SectionLabel className="mb-2">Species</SectionLabel>
              <View className="flex-row flex-wrap gap-2">
                {SPECIES_OPTIONS.map((species) => {
                  const active = form.species === species;
                  return (
                    <Pressable
                      key={species}
                      onPress={() => updateField("species", species)}
                      className={`px-4 py-2.5 rounded-lg border ${
                        active ? "bg-accent border-accent" : "bg-surface border-border"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium font-sans ${
                          active ? "text-text-inverse" : "text-text-secondary"
                        }`}
                      >
                        {species}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {errors.species ? (
                <Text className="text-danger text-xs mt-1.5 font-sans">{errors.species}</Text>
              ) : null}
            </View>

            <AppTextInput
              label="Breed"
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
          </View>

          <View className="flex-row gap-3 mt-8">
            <View className="flex-1">
              <AppButton
                label="Cancel"
                variant="secondary"
                onPress={() =>
                  router.replace(isWeb ? "/(web)/pets" : "/(app)/(tabs)/pets")
                }
                disabled={saving}
              />
            </View>
            <View className="flex-1">
              <AppButton
                label="Save changes"
                onPress={handleSubmit}
                loading={saving}
                disabled={!form.petName || !form.species || !hasChanges}
              />
            </View>
          </View>

          {visitCount > 0 ? (
            <View className="mt-8 pt-6 border-t border-border">
              <Text className="text-sm font-semibold text-text-primary mb-4 font-sans">
                Recent visits
              </Text>
              <View className="gap-2">
                {pet.appointmentIDs?.map((appointmentId) => (
                  <Pressable
                    key={appointmentId}
                    onPress={() => openVisit(appointmentId)}
                    className="bg-surface border border-border rounded-xl px-4 py-3.5 flex-row items-center justify-between"
                    style={({ pressed }) => ({
                      opacity: pressed ? 0.94 : 1,
                      borderColor: pressed ? colors.borderStrong : colors.border,
                    })}
                  >
                    <View className="flex-row items-center gap-3">
                      <View className="w-9 h-9 rounded-lg bg-surfaceMuted items-center justify-center">
                        <Ionicons
                          name="calendar-outline"
                          size={iconSize.md}
                          color={colors.text.primary}
                        />
                      </View>
                      <Text className="text-sm font-medium text-text-primary font-sans">
                        View appointment
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={iconSize.md} color={colors.text.muted} />
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
        </Panel>
      </ScrollView>
    </Container>
  );
}
