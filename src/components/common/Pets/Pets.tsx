import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Fab from "@/components/ui/Fab";
import Loader from "@/components/common/Loader/Loader";
import Container from "@/components/common/Container/Container";
import PetCard from "@/components/common/PetCard/PetCard";
import Panel from "@/components/layout/Panel";
import ScreenScroll from "@/components/layout/ScreenScroll";
import AppButton from "@/components/ui/AppButton";
import { useGetPets } from "@/features/pet/hooks/useGetPet";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect } from "react";
import { Platform, Text, View } from "react-native";

export default function Pets() {
  const { pets, fetchPets, loading } = useGetPets();
  const isEmpty = pets.length === 0;
  const { isCompact, isNative } = useIsCompactScreen();
  const isWeb = Platform.OS === "web";

  useEffect(() => {
    fetchPets();
  }, []);

  const handleAddPet = () => {
    router.push(isWeb ? "/(web)/web-add-pet" : "/(app)/add-pet");
  };

  if (loading) return <Loader fullScreen />;

  const addPetToolbar = !isEmpty ? (
    <View className="gap-3 mb-6">
      <View className="flex-row flex-wrap items-center justify-between gap-3">
        <View className="px-3.5 py-2 rounded-lg bg-accent">
          <Text className="text-xs font-semibold text-text-inverse font-sans">
            {pets.length} {pets.length === 1 ? "pet" : "pets"}
          </Text>
        </View>
        {!isNative && !isCompact ? (
          <AppButton
            label="Add pet"
            onPress={handleAddPet}
            fullWidth={false}
            size="sm"
          />
        ) : null}
      </View>
      {!isNative && isCompact ? (
        <AppButton label="Add pet" onPress={handleAddPet} fullWidth size="sm" />
      ) : null}
    </View>
  ) : null;

  const panel = (
    <Panel
      wide={!isCompact}
      title={isCompact ? undefined : "My pets"}
      lead={isCompact ? undefined : "Registered pets for booking appointments."}
    >
      {addPetToolbar}

      {isEmpty ? (
        <EmptyState
          title="No pets yet"
          description="Add your first pet to start booking appointments."
          buttonLabel="Add pet"
          onPress={handleAddPet}
        />
      ) : (
        <View className="gap-0">
          {pets.map((item) => (
            <PetCard
              key={item.id}
              item={item}
              onPress={() =>
                router.push(
                  isNative ? `/(app)/pet/profile/${item.id}` : `/pets/profile/${item.id}`,
                )
              }
            />
          ))}

          {isWeb && !isCompact ? (
            <View className="mt-6 pt-6 border-t border-border">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-lg bg-surfaceMuted items-center justify-center">
                  <Ionicons name="paw-outline" size={iconSize.lg} color="#0a0a0a" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-text-primary font-sans">
                    Register another pet
                  </Text>
                  <Text className="text-xs text-text-secondary mt-0.5 font-sans">
                    Add siblings or additional companions.
                  </Text>
                </View>
                <AppButton
                  label="Add pet"
                  onPress={handleAddPet}
                  fullWidth={false}
                  size="sm"
                />
              </View>
            </View>
          ) : null}
        </View>
      )}
    </Panel>
  );

  const page = (
    <Container className={isWeb ? "max-w-4xl mx-auto w-full flex-1" : "flex-1"}>
      {isCompact ? (
        <HeaderSection
          title="My pets"
          description="Registered pets for booking appointments."
        />
      ) : null}
      {panel}
    </Container>
  );

  return (
    <View className="flex-1">
      <ScreenScroll withTabBar={isNative}>{page}</ScreenScroll>
      {!isEmpty && isNative ? (
        <Fab label="Add pet" onPress={handleAddPet} withTabBar icon="paw" />
      ) : null}
    </View>
  );
}
