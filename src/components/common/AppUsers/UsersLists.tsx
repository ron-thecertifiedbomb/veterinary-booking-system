import { UserProfile, UserRole } from "@/features/users/types/types";
import { logger } from "@/utils/logger/logger";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface UsersListProps {
  user: UserProfile | null;
}

export const UsersList: React.FC<UsersListProps> = ({ user }) => {
  
  const name = user?.name?.trim() || "Anonymous User";
  const initial = name.charAt(0).toUpperCase();
  const email = user?.email || "No email linked";
  const id = user?.id || "No ID linked";
  const phone = user?.phone || "NOT PROVIDED";
  const role: UserRole = user?.role || "CUSTOMER";
  const active = user?.isActive;

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

  return (
    // Height Optimization: Reduced padding from p-4 to p-3.5, reduced mb-4 to mb-3, smaller corner radius
    <View className="bg-white dark:bg-zinc-950 p-3.5 rounded-2xl mb-3 border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
      
      {/* ─── HEADER ROW ─── */}
      <View className="flex-row items-center mb-3">
        {/* Height Optimization: Shrunk avatar box from w-16 h-16 down to w-11 h-11 */}
        <View className="w-11 h-11 bg-zinc-950 dark:bg-zinc-100 rounded-xl items-center justify-center mr-3 shadow-sm border border-zinc-800 dark:border-zinc-200">
          <Text className="text-white dark:text-zinc-900 text-lg font-black tracking-tighter">
            {initial}
          </Text>
        </View>

        {/* Name, Role & ID */}
        <View className="flex-1 justify-center">
          <View className="flex-row items-baseline justify-between">
            <Text 
              className="text-base font-black tracking-tight text-zinc-950 dark:text-white uppercase leading-none max-w-[70%]" 
              numberOfLines={1}
            >
              {name}
            </Text>
            {/* Added pill label directly in header to save layout rows */}
            <Text className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
              {getRoleLabel()}
            </Text>
          </View>
          
          <Text 
            className="text-[9px] font-mono text-zinc-400 dark:text-zinc-500 mt-1" 
            numberOfLines={1}
          >
            ID: {id}
          </Text>
        </View>
      </View>

      {/* ─── COMBINED DATA ROW ─── */}
      {/* Height Optimization: Merged two separate vertical block boxes into 1 clean, shallow horizontal data row */}
      <View className="flex-row items-center justify-between rounded-xl px-3 py-2 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/80 mb-3">
        <View className="flex-1">
          <Text className="text-[8px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Contact Phone
          </Text>
          <Text className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 uppercase" numberOfLines={1}>
            {phone}
          </Text>
        </View>
        
        <View className="flex-1 pl-2 border-l border-zinc-200/60 dark:border-zinc-800">
          <Text className="text-[8px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500">
            Email Address
          </Text>
          <Text className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 lowercase" numberOfLines={1}>
            {email}
          </Text>
        </View>
      </View>

      {/* ─── ACTION TRIGGER AREA ─── */}
      {/* Height Optimization: Stripped unnecessary wrapper paddings, making the trigger block shallow */}
      <View className="flex-row justify-end items-center">
        <TouchableOpacity 
          activeOpacity={0.8}
          // Height Optimization: Reduced py-3 to py-1.5 for a slim action layout design
          className="bg-zinc-950 dark:bg-zinc-100 px-3.5 py-1.5 rounded-lg shadow-sm"
        >
          <Text className="text-white dark:text-zinc-900 text-[9px] font-black tracking-widest uppercase">
            View Profile
          </Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};
