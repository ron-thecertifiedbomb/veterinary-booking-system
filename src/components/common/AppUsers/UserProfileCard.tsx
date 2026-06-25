import { UserProfile, UserRole } from "@/features/users/types/types";
import { logger } from "@/utils/logger/logger";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UserProfileCardProps {
  profile: UserProfile | null;
  onEditPress: () => void;
}

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: "Admin",
  STAFF: "Staff",
  CUSTOMER: "CUSTOMER",
};

const METADATA_LABELS: Record<UserRole, string> = {
  ADMIN: "System Admin Control Channel",
  STAFF: "Clinical Personnel Parameters",
  CUSTOMER: "Modify account info or pet records",
};

const DEFAULT_METADATA = "Modify account info or credentials";

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ profile, onEditPress }) => {
  const name = profile?.name?.trim() || "Anonymous User";
  const initial = name.charAt(0).toUpperCase(); 
  const email = profile?.email || "No email linked";
  const phone = profile?.phone || "NOT PROVIDED";
  const role: UserRole = profile?.role || "CUSTOMER";
  const isVerified = !!profile?.isActive;

  const roleLabel = useMemo(() => ROLE_LABELS[role] || ROLE_LABELS.CUSTOMER, [role]);
  const subProfileMeta = useMemo(() => METADATA_LABELS[role] || DEFAULT_METADATA, [role]);

  React.useEffect(() => {
    logger.info("role", role);
  }, [role]);

  return (
    <View className="bg-white dark:bg-zinc-950 p-4 lg:p-5 rounded-[32px] mb-4 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
      
      {/* ─── HEADER: AVATAR & IDENTITY ─── */}
      <View className="flex-row items-center mb-5">
        <View className="w-16 h-16 bg-zinc-950 dark:bg-zinc-100 rounded-full items-center justify-center mr-4 shadow-sm border border-zinc-800 dark:border-zinc-200">
          <Text className="text-white dark:text-zinc-900 text-3xl font-black tracking-tighter">
            {initial}
          </Text>
        </View>
        <View className="flex-1 justify-center">
   
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
         Email:{email}
          </Text>
        </View>
      </View>

      {/* ─── DATA GRID: ROLE & PHONE ─── */}
      <View className="flex-row rounded-[20px] p-4  mb-4">
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
           Role
          </Text>
          <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase">
            {roleLabel}
          </Text>
        </View>
        <View className="w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-4" />
        <View className="flex-1 items-end">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Contact
          </Text>
          <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase">
            {phone}
          </Text>
        </View>
      </View>

      {/* ─── ROLE-SPECIFIC SUB-PROFILES ─── */}
      {role === "CUSTOMER" && profile?.customerProfile && (
        <View className="flex-row justify-between rounded-[20px] p-4 mb-5">
          <View>
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">Total Pets</Text>
            <Text className="text-sm font-black text-zinc-900 dark:text-zinc-100">{profile.customerProfile.totalPets}</Text>
          </View>
          <View className="items-end">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">Appointments</Text>
            <Text className="text-sm font-black text-zinc-900 dark:text-zinc-100">{profile.customerProfile.totalAppointments}</Text>
          </View>
        </View>
      )}

      {role === "STAFF" && profile?.staffProfile && (
        <View className="flex-row justify-between bg-zinc-50 dark:bg-zinc-900/50 rounded-[20px] p-4 border border-zinc-100 dark:border-zinc-800/80 mb-5">
          <View className="flex-1 mr-2">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">Specialization</Text>
            <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase" numberOfLines={1}>
              {(profile as any).staffProfile.specialization}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">Assigned Appts</Text>
            <Text className="text-sm font-black text-zinc-900 dark:text-zinc-100">{(profile as any).staffProfile.totalAssignedAppointments}</Text>
          </View>
        </View>
      )}

      {role === "ADMIN" && profile?.adminProfile && (
        <View className="flex-row justify-between bg-zinc-50 dark:bg-zinc-900/50 rounded-[20px] p-4 border border-zinc-100 dark:border-zinc-800/80 mb-5">
          <View className="flex-1 mr-2">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">Department</Text>
            <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase" numberOfLines={1}>
              {(profile as any).adminProfile.department}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">Position</Text>
            <Text className="text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase">
              {String((profile as any).adminProfile.position)}
            </Text>
          </View>
        </View>
      )}

      {/* ─── CONFIGURATIONS & STATUS BANNER ─── */}
      <View className="flex-col">


        <View className="rounded-[20px] p-3 flex-row justify-end items-end ">
        
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
