
import { UserProfile, UserRole } from "@/features/users/types/types";
import { logger } from "@/utils/logger/logger";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  profile: UserProfile | null;
  onEditPress: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEditPress }) => {
  
  const name = profile?.name?.trim() || "Anonymous User";
  const initial = name.charAt(0).toUpperCase();
  const email = profile?.email || "No email linked";
  const phone = profile?.phone || "NOT PROVIDED";
  const role: UserRole = profile?.role || "CUSTOMER";
  const isVerified = profile?.isActive;

  const getRoleLabel = (): string => {
    switch (role) {
      case "ADMIN": 
        return "System Admin";
      case "STAFF": 
        return "Staff Vet";
      case "CUSTOMER": 
        return "Pet Owner";
      default: 
        return "Pet Owner";
    }
  };
logger.info('role', role)
  const getSubProfileMeta = (): string => {
    // FIXED: Changed getRoleLabel to profile
    if (profile?.role === "ADMIN") return "System Admin Control Channel";
    if (profile?.role === "STAFF") return "Clinical Personnel Parameters";
    if (profile?.role === "CUSTOMER") return "Modify account info or pet records";
    return "Modify account info or credentials";
  };

  return (
    <View className="bg-white dark:bg-zinc-950 p-4 lg:p-5 rounded-[32px] mb-4 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
      
      {/* ─── HEADER: AVATAR & IDENTITY ─── */}
      <View className="flex-row items-center mb-5">
        {/* Avatar */}
        <View className="w-16 h-16 bg-zinc-950 dark:bg-zinc-100 rounded-[20px] items-center justify-center mr-4 shadow-sm border border-zinc-800 dark:border-zinc-200">
          <Text className="text-white dark:text-zinc-900 text-3xl font-black tracking-tighter">
            {initial}
          </Text>
        </View>

        {/* Name & Email */}
        <View className="flex-1 justify-center">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Account Holder
          </Text>
          <Text 
            className="text-2xl font-black tracking-tighter text-zinc-950 dark:text-white uppercase leading-none mb-1.5" 
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text 
            className="text-[10px] font-mono font-bold tracking-tight text-zinc-500 dark:text-zinc-400" 
            numberOfLines={1}
          >
            {email}
          </Text>
        </View>
      </View>

      {/* ─── DATA GRID: ROLE & PHONE ─── */}
      <View className="flex-row bg-zinc-50 dark:bg-zinc-900/50 rounded-[20px] p-4 border border-zinc-100 dark:border-zinc-800/80 mb-5">
        {/* Left Column: Role */}
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Access Level
          </Text>
          <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase">
            {getRoleLabel()}
          </Text>
        </View>
        
        {/* Divider */}
        <View className="w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-4" />
        
        {/* Right Column: Phone */}
        <View className="flex-1 items-end">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Contact Phone
          </Text>
          <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase">
            {phone}
          </Text>
        </View>
      </View>

      {/* ─── CONFIGURATIONS & STATUS BANNER ─── */}
      <View className="flex-col">
        {/* Sub-label & Status Indicator */}
        <View className="flex-row justify-between items-center mb-2 px-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500">
            System Status
          </Text>
          <View className={`flex-row items-center px-2 py-0.5 rounded-full border ${isVerified ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' : 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900'}`}>
            <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isVerified ? 'bg-emerald-500' : 'bg-red-500'}`} />
            <Text className={`text-[9px] font-black tracking-widest uppercase ${isVerified ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {isVerified ? "Verified" : "Inactive"}
            </Text>
          </View>
        </View>

        {/* Action Button Area */}
        <View className="bg-zinc-100 dark:bg-zinc-900 rounded-[20px] p-3 flex-row justify-between items-center border border-zinc-200 dark:border-zinc-800">
          <View className="flex-1 mr-4 pl-2">
            <Text className="text-[10px] font-bold tracking-tight text-zinc-600 dark:text-zinc-400 leading-snug">
              {getSubProfileMeta()}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={onEditPress} 
            activeOpacity={0.8}
            className="bg-zinc-950 dark:bg-zinc-100 px-5 py-3 rounded-xl shadow-sm"
          >
            <Text className="text-white dark:text-zinc-900 text-[10px] font-black tracking-widest uppercase">
              Edit
            </Text>
          </TouchableOpacity>
        </View>
      </View>

    </View>
  );
};