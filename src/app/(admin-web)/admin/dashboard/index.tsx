import Loader from '@/components/common/Loader/Loader';
import { ServerTimeBanner } from '@/components/common/ServerTimeBanner/ServerTimeBanner';
import { useGetDashBoardMetrics } from '@/features/admin/hooks/useGetDashBoardMetrics';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

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

      fetchMetrics();

  }, []);



  const onCardPress = (target: string) => {
    console.log(`Navigating directly to database entity segment: ${target}`);
  };

  if (loading && !metrics) {
    return <Loader fullScreen />;
  }

  return (
    <ScrollView 
      className="flex-1 max-w-3xl mx-auto w-full " 
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40 }}
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
        className="w-full rounded-[32px]  relative overflow-hidden mb-1 mt-1 lg:mb-4 lg:mt-4"
      >
          <View className="flex-1 pl-2">
            <Text className="text-lg lg:text-3xl font-black tracking-tighter ">
              {metrics?.todayAppointments} BOOKED SCHEDULES
            </Text>
          </View>
          
      </TouchableOpacity>

      {/* ─── GRID TITLE LINE ─── */}
      <View className="flex-row items-center space-x-2">
  {/* Live User Count Indicator Pill */}
  <View className="flex-row items-center bg-zinc-200/60 dark:bg-zinc-900 px-2.5 py-1 rounded-full">
    <View className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1" />
    <Text className="text-[9px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
      {metrics?.activeUsers ?? 0} / {(metrics?.totalCustomers ?? 0) + (metrics?.totalStaff ?? 0)} Live
    </Text>
  </View>

  {/* New: Unbooked Remaining Slot Pill */}
  <View className="flex-row items-center bg-zinc-200/60 dark:bg-zinc-900 px-2.5 py-1 rounded-full">
    <View className={`h-1.5 w-1.5 rounded-full mr-1 ${metrics?.todayUnbookedCount ? 'bg-amber-500' : 'bg-zinc-400'}`} />
    <Text className="text-[9px] font-extrabold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
      {metrics?.todayUnbookedCount ?? 0} Vacant
    </Text>
  </View>
</View>


      {/* ─── FIXED DENSITY METRIC GRID ─── */}
      {/* Changed to flex-wrap with a explicit layout gap percentage alignment */}
      <View className="flex-row flex-wrap justify-between items-start mb-5">
        
        {/* Card 1: Customers */}


    
    
   
      </View>
      {/* ─── FIXED DENSITY METRIC GRID ─── */}
      <View className="flex-row flex-wrap justify-between items-start mb-5">
        
        {/* Card 1: Total Customers */}
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => onCardPress('customers')}
          className="w-[48.5%] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs justify-between min-h-[140px] mb-4"
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
              {metrics?.totalCustomers ?? 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                {metrics?.activeCustomers ?? 0} Active Profiles
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card 2: Clinical Staff */}
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => onCardPress('staff')}
          className="w-[48.5%] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs justify-between min-h-[140px] mb-4"
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
              {metrics?.totalStaff ?? 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
                {metrics?.activeStaff ?? 0} On Duty Today
              </Text>
            </View>
          </View> 
        </TouchableOpacity>

        {/* Card 3: Unbooked Open Slots */}
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => onCardPress('appointments')}
          className="w-[48.5%] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs justify-between min-h-[140px] mb-4"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex-1 mr-1" numberOfLines={2}>
              Vacant Hours
            </Text>
            <View className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 dark:text-zinc-400">
                <Path d={ICONS.calendar} />
              </Svg>
            </View>
          </View>
          <View className="mt-4">
            <Text className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {metrics?.todayUnbookedCount ?? 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-tight">
                Slots Available Today
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        {/* Card 4: Registered Pets */}
        <TouchableOpacity 
          activeOpacity={0.85}
          onPress={() => onCardPress('pets')}
          className="w-[48.5%] bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs justify-between min-h-[140px] mb-4"
        >
          {/* Header Row: Title & Vector Graphic Icon Box */}
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex-1 mr-1" numberOfLines={2}>
              Registered Pets
            </Text>
            <View className="p-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-500 dark:text-zinc-400">
                <Path d={ICONS.paw} />
              </Svg>
            </View>
          </View>

          {/* Metric Counter & Sub-Label Status Indicator */}
          <View className="mt-4">
            <Text className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              {metrics?.totalPets ?? 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-tight">
               Total Pets
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Spacer layout element to balance out odd grids nicely if needed */}
        <View className="w-[48.5%] h-0" />
      </View>
      
    </ScrollView>
  );
}

