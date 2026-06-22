import React from "react";
import { Text, View, Pressable, Platform } from "react-native";
import { router } from "expo-router"; 

interface PetDetailedCard {
  id: string;
  petName: string;
  species: string;
  breed?: string;
  weight?: number;
  appointmentIDs?: string[]; 
}

interface PetDetailedCardProps {
  item?: PetDetailedCard | null;
  onPress?: () => void; 
}

export default function PetDetailedCard({ item, onPress }: PetDetailedCardProps) {
  if (!item) return null;

  const initial = item.petName ? item.petName.charAt(0).toUpperCase() : "?";
  const apptIDs = item.appointmentIDs || [];
  const apptCount = apptIDs.length;

  return (
    <View className="bg-white border border-zinc-200/80 p-5 rounded-[24px] mb-4 shadow-sm">
      
      {/* ─── TOP SECTION: PROFILE DOSSIER ─── */}
      <View className="flex-row items-center">
        
        {/* Left: Avatar Block */}
        <View className="w-16 h-16 bg-zinc-950 rounded-2xl items-center justify-center mr-4 border border-zinc-800 shadow-sm">
          <Text className="text-white text-3xl font-black tracking-tighter">
            {initial}
          </Text>
          {/* Micro-label inside avatar for extreme detail */}
          <View className="absolute -bottom-2 bg-white px-1.5 py-0.5 rounded border border-zinc-200 shadow-sm">
            <Text className="text-[6px] font-black text-zinc-900 tracking-widest uppercase">ID:{item.id.slice(-4)}</Text>
          </View>
        </View>

        {/* Middle: Name & Labeled Tags */}
        <View className="flex-1 justify-center">
          
          {/* Name Block with Label */}
          <View className="mb-2">
            <Text className="text-[8px] font-black tracking-widest text-zinc-400 uppercase mb-0.5">
              Subject Name
            </Text>
            <Text 
              className="text-2xl font-black tracking-tighter text-zinc-900 uppercase leading-none"
              numberOfLines={1}
            >
              {item.petName}
            </Text>
          </View>
          
          {/* Inline Labeled Badges */}
          <View className="flex-row flex-wrap items-center gap-2">
            <View className="bg-zinc-50 px-2 py-1 rounded-md border border-zinc-200 flex-row items-center gap-1.5">
              <Text className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Species:</Text>
              <Text className="text-[10px] font-black text-zinc-700 uppercase tracking-wider">{item.species}</Text>
            </View>
            
            {item.breed && (
              <View className="bg-zinc-50 px-2 py-1 rounded-md border border-zinc-200 flex-row items-center gap-1.5">
                <Text className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Breed:</Text>
                <Text className="text-[10px] font-black text-zinc-700 uppercase tracking-wider">{item.breed}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Right: Metrics & Chevron */}
        <View className="flex-row items-center pl-3">
          {item.weight && (
            <View className="items-end mr-4">
              <Text className="text-[8px] font-black tracking-widest text-zinc-400 uppercase mb-0.5">
                Weight
              </Text>
              <View className="flex-row items-baseline gap-0.5">
                <Text className="text-2xl font-black text-zinc-900 tracking-tighter leading-none">
                  {item.weight}
                </Text>
                <Text className="text-[9px] font-black tracking-[0.1em] text-zinc-400 uppercase">
                  LBS
                </Text>
              </View>
            </View>
          )}

          {/* Structural Divider */}
          <View className="w-[1px] h-12 bg-zinc-100 mr-4" />

          {/* Action Area */}
          <View className="items-center justify-center">
             <Text className="text-zinc-300 text-3xl font-light">›</Text>
          </View>
        </View>
      </View>

      {/* ─── BOTTOM SECTION: APPOINTMENT HISTORY LOG ─── */}
      {apptCount > 0 && (
        <View className="mt-5 pt-4 border-t border-zinc-100">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <View className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2 shadow-sm" />
              <Text className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                Appointment History
              </Text>
            </View>
            <Text className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">
              Total: {apptCount}
            </Text>
          </View>
          
          <View className="flex-row flex-wrap gap-2">
            {apptIDs.map((apptId, index) => {
              const webPath = `/appointments/appointment/${apptId}`;
              const mobilePath = `/(app)/appointment/${apptId}`; 

              return (
                <Pressable
                  key={apptId} 
                  onPress={() => {
                    const destination = Platform.OS === 'web' ? webPath : mobilePath;
                    router.push(destination as any);
                  }}
                  style={({ pressed }) => ({
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  })}
                >
                  <View className="flex-row items-center bg-white px-2.5 py-1.5 rounded-md border border-zinc-200 shadow-sm">
                    <Text className="text-[9px] font-black text-zinc-300 mr-2">
                      {String(index + 1).padStart(2, '0')}
                    </Text>
                    <Text className="text-[10px] font-mono text-zinc-700 uppercase tracking-tight">
                      {apptId}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
}