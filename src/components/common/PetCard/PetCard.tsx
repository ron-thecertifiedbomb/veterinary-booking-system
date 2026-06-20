import { Href } from "expo-router";
import React from "react";
import { Text, View, Pressable } from "react-native";

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
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.99 : 1 }],
      })}
      className="bg-white border border-zinc-100 p-5 rounded-3xl flex-row items-center justify-between mb-4"
    >
      {/* ─── LEFT: PRIMARY CORE DATA ─── */}
      <View className="flex-1 mr-4">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
          Name
        </Text>
        <Text className="text-xl font-black tracking-tighter text-black uppercase">
          {item.petName}
        </Text>
        <Text className="text-xs font-bold text-zinc-500 mt-1 uppercase tracking-wide">
          {item.species} {item.breed ? `/ ${item.breed}` : "/ UNKNOWN"}
        </Text>
      </View>

      {/* Dynamic Structural Partition Line aligned to the global zinc profile style */}
      <View className="w-[1px] h-10 bg-zinc-100 mx-4" />

      {/* ─── RIGHT: STARK INDICATOR ARROW ─── */}
      <View className="pl-2">
        <Text className="text-zinc-300 text-xl font-black">›</Text>
      </View>
    </Pressable>
  );
}
