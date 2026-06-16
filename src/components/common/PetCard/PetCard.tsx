import React from "react";
import { Text, View } from "react-native";
import AppPetCard from "../AppPetCard/AppPetCard";

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
    <AppPetCard onPress={onPress}>
      {/* 
        Parent Card Framework Shell is configured as a high-contrast container 
        with rounded-3xl geometry matching your Appointment cards.
      */}
      <View className="bg-white dark:bg-black p-4 rounded-3xl flex-row items-center justify-between">
        
        {/* ─── LEFT: PRIMARY CORE DATA ─── */}
        <View className="flex-1 mr-4">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
           Name
          </Text>
          <Text className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase">
            {item.petName}
          </Text>
          <Text className="text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-1 uppercase tracking-wide">
            {item.species} / {item.breed || "UNKNOWN"}
          </Text>
        </View>

        {/* Dynamic Structural Partition Line */}
        <View className="w-[1px] h-10 bg-zinc-200 dark:bg-zinc-800 mx-4" />

        <View className="ml-4 pl-2">
          <Text className="text-black dark:text-white text-xl font-black">›</Text>
        </View>

      </View>
    </AppPetCard>
  );
}
