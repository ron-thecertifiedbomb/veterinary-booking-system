import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Loader from '@/components/common/Loader/Loader';
import { ServerTimeBanner } from '@/components/common/ServerTimeBanner/ServerTimeBanner'; // Imported here
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useGetDashBoardMetrics } from '@/features/admin/hooks/useGetDashBoardMetrics';

const ICONS = {
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm7-3a3 3 0 11-1.5-3",
  briefcase: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  paw: "M12 14a3 3 0 100-6 3 3 0 000 6zm-7-2a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zm14 0a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM12 6a2 2 0 110-4 2 2 0 010 4z"
};

export default function AdminDashboardScreen() {
  const { token } = useAuth();
  const { metrics, loading, fetchMetrics, serverTime } = useGetDashBoardMetrics();
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (token) {
      fetchMetrics();
    }
  }, [token]);

  const data = metrics || {
    todayAppointments: 0,
    totalCustomers: 0,
    totalStaff: 0,
    activeUsers: 0,
    activeCustomers: 0,
    activeStaff: 0,
    totalPets: 0,
  };

  const onCardPress = (target: string) => {
    console.log(`Navigating directly to database entity segment: ${target}`);
  };

  if (loading && !metrics) {
    return <Loader fullScreen />;
  }

  return (
    <ScrollView 
      className="flex-1 max-w-3xl mx-auto w-full" 
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchMetrics} tintColor="#18181B" />
      }
    >
      {/* ─── LIVE SERVER TIME SYNCHRONIZATION HUD ─── */}
      <ServerTimeBanner serverTime={serverTime} loading={loading} />

      {/* ─── HERO SECTION: ACTION DRIVEN BANNER ─── */}
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => onCardPress('appointments')}
        className="w-full  p-6 rounded-[32px] mb-5 relative overflow-hidden"
      >
        <View className="flex-row justify-between items-start z-10">
          <View className="flex-1 mr-4">
            <Text className="text-[10px] font-black tracking-[0.2em] uppercase  mb-1">
              Today's Operations
            </Text>
            <Text className="text-3xl font-black tracking-tighter">
              {data.todayAppointments} SCHEDULES
            </Text>
      
          </View>
          
          <View className="p-3 rounded-2xl bg-zinc-800 dark:bg-zinc-200">
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white dark:text-zinc-900">
              <Path d={ICONS.calendar} />
            </Svg>
          </View>
        </View>
      </TouchableOpacity>

      {/* ─── GRID TITLE LINE ─── */}
      <View className="mb-3 px-1 flex-row justify-between items-center">
        <Text className="text-[11px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500">
     Metrics
        </Text>
        <View className="flex-row items-center space-x-1.5 bg-zinc-200/60 dark:bg-zinc-900 px-2.5 py-1 rounded-full">
          <View className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <Text className="text-[9px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
            {data.activeUsers} / {data.totalCustomers + data.totalStaff} Live
          </Text>
        </View>
      </View>

      {/* ─── HIGH DENSITY USER ACCOUNTS METRIC GRID ─── */}
      <View className="flex-row justify-between mb-5">
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => onCardPress('customers')}
          className="w-[48.5%] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs justify-between min-h-[140px]"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex-1 mr-1" numberOfLines={2}>
              Total Customers
            </Text>
            <View className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 dark:text-zinc-400">
                <Path d={ICONS.users} />
              </Svg>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {data.totalCustomers}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                {data.activeCustomers} Active Profiles
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => onCardPress('staff')}
          className="w-[48.5%] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs justify-between min-h-[140px]"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex-1 mr-1" numberOfLines={2}>
              Clinical Staff
            </Text>
            <View className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 dark:text-zinc-400">
                <Path d={ICONS.briefcase} />
              </Svg>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {data.totalStaff}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
                {data.activeStaff} On Duty Today
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* ─── FOOTPRINT LAYER: CLINIC RECORD HIGHLIGHT ─── */}
      <View className="mb-2 px-1">
        <Text className="text-[11px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-3">
          Clinic Capacity
        </Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => onCardPress('pets')}
        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/80 p-5 rounded-3xl shadow-xs flex-row items-center justify-between"
      >
        <View className="flex-row items-center flex-1 mr-4">
          <View className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800 mr-4">
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-900 dark:text-zinc-100">
              <Path d={ICONS.paw} />
            </Svg>
          </View>
          <View className="flex-1">
            <Text className="text-zinc-900 dark:text-zinc-50 text-lg font-black tracking-tight uppercase leading-5">
              {data.totalPets} Registered Pets
            </Text>
            <Text className="text-zinc-400 dark:text-zinc-500 text-xs font-medium mt-0.5" numberOfLines={1}>
              Complete ecosystem medical dataset profiles
            </Text>
          </View>
        </View>

        <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 dark:text-zinc-700">
          <Path d="M9 5l7 7-7 7" />
        </Svg>
      </TouchableOpacity>
    </ScrollView>
  );
}
