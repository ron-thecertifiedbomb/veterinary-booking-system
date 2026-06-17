import { UserRole } from "@/features/auth/types/auth.user";
import { userProfile } from "@/features/users/types/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
  profile: userProfile | null;
  onEditPress: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEditPress }) => {
  
  const name = profile?.name?.trim() || "Anonymous User";
  const email = profile?.email || "No email linked";
  const phone = profile?.phone || "NOT PROVIDED";
  const role: UserRole = profile?.role || "CUSTOMER";
  const systemStatus = profile?.isActive ? "VERIFIED" : "INACTIVE";

  // 2. Explicitly evaluating all core enum variants including CUSTOMER
  const getRoleLabel = (): string => {
    switch (role) {
      case "ADMIN": 
        return "ADMIN";
      case "STAFF": 
        return "STAFF VET";
      case "CUSTOMER": 
        return "PET OWNER";
      default: 
        return "PET OWNER";
    }
  };

  // 3. Extract Meta Context Labels Based on What Sub-profile Exists
  const getSubProfileMeta = (): string => {
    if (profile?.adminProfile) return "System Admin Control Channel";
    if (profile?.staffProfile) return "Clinical Personnel Parameters";
    if (profile?.customerProfile) return "Modify account info or pet records";
    return "Modify account info or credentials";
  };

  return (
    <View className="bg-white p-5 rounded-3xl mb-4 border border-zinc-200 dark:border-zinc-800 shadow-sm">
      
      {/* ─── IDENTITY BLOCK ─── */}
      <View className="flex-row justify-between items-start pb-4 border-b border-zinc-100 dark:border-zinc-800">
        <View className="flex-1 mr-3">
          <Text className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-1.5">
            Account Holder
          </Text>
          <Text className="text-lg lg:text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 uppercase leading-6" numberOfLines={2}>
            {name}
            </Text>
            <>
            <Text className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Contact Phone
          </Text>
          <Text className="text-xs font-mono font-bold tracking-tight text-zinc-500 dark:text-zinc-400 mt-1.5" numberOfLines={1}>
            {email}
          </Text>
          </>
   
       
        </View>

        {/* Stark monochrome role pillar badge */}
        <View className="bg-transparent px-3 py-1 border border-zinc-900 dark:border-zinc-100 rounded-full mt-0.5">
          <Text className="text-[9px] font-black tracking-widest uppercase text-zinc-900 dark:text-zinc-100">
            {getRoleLabel()}
          </Text>
        </View>
      </View>

      {/* ─── ACCOUNT DATA GRID (MOBILE-FIRST VERTICAL STACK) ─── */}
      <View className="py-4 space-y-4">
        {/* Contact Phone Block */}
        <View>
          <Text className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Contact Phone
          </Text>
          <Text className="text-sm font-bold uppercase text-zinc-800 dark:text-zinc-200" numberOfLines={1}>
            {phone}
          </Text>
        </View>
        
        {/* System Status Block */}
        <View>
          <Text className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            System Status
          </Text>
          <Text className={`text-sm font-extrabold uppercase ${profile?.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
            {systemStatus}
          </Text>
        </View>
      </View>

      {/* ─── INNER INTERACTIVE CONTROL ROW ─── */}
      <View className="bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl p-4 flex-row justify-between items-center border border-zinc-100 dark:border-zinc-900 mt-1">
        <View className="flex-1 mr-4">
          <Text className="text-[9px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Profile Configurations
          </Text>
          <Text className="text-xs font-bold tracking-tight text-zinc-600 dark:text-zinc-400 leading-4">
            {getSubProfileMeta()}
          </Text>
        </View>
        
        <TouchableOpacity 
          onPress={onEditPress} 
          activeOpacity={0.85}
          className="bg-zinc-900 dark:bg-zinc-100 px-4 py-2.5 rounded-full shadow-sm"
        >
          <Text className="text-white dark:text-zinc-900 text-[10px] font-black tracking-widest uppercase">
            Edit
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};
