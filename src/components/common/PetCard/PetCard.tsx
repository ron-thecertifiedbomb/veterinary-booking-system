import SectionLabel from "@/components/ui/SectionLabel";
import { colors, iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface PetItem {
  id: string;
  petName: string;
  species: string;
  breed?: string;
  weight?: number;
}

interface PetCardProps {
  item: PetItem;
  onPress: () => void;
}

export default function PetCard({ item, onPress }: PetCardProps) {
  const subtitle = [item.species, item.breed].filter(Boolean).join(" · ");

  return (
    <Pressable
      onPress={onPress}
      className="bg-surface border border-border rounded-xl p-5 flex-row items-center mb-3"
      style={({ pressed }) => ({ opacity: pressed ? 0.94 : 1 })}
    >
      <View className="w-10 h-10 rounded-lg bg-surfaceMuted items-center justify-center mr-4">
        <Ionicons name="paw-outline" size={iconSize.lg} color={colors.text.primary} />
      </View>

      <View className="flex-1 mr-3 min-w-0">
        <SectionLabel>Pet</SectionLabel>
        <Text className="text-body font-semibold text-text-primary mt-1 font-sans">{item.petName}</Text>
        {subtitle ? (
          <Text className="text-sm text-text-secondary mt-0.5 font-sans">{subtitle}</Text>
        ) : null}
      </View>

      <Ionicons name="chevron-forward" size={iconSize.md} color={colors.text.muted} />
    </Pressable>
  );
}
