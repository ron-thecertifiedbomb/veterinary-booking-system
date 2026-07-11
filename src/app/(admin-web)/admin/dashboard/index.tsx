import HeaderSection from '@/components/common/HeaderSection/HeaderSection';
import Loader from '@/components/common/Loader/Loader';
import { ServerTimeBanner } from '@/components/common/ServerTimeBanner/ServerTimeBanner';
import { useGetDashBoardMetrics } from '@/features/admin/hooks/useGetDashBoardMetrics';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { useRouter } from 'expo-router';
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
  const router = useRouter();
  const { token } = useAuth();
  const { metrics, loading, fetchMetrics, serverTime } = useGetDashBoardMetrics();
  const { width } = useWindowDimensions();

  useEffect(() => {

      fetchMetrics();

  }, []);



  const onCardPress = (target: string) => {
    switch (target) {
      case "customers":
        router.push("/(admin-web)/admin/customers");
        break;
      case "staff":
        router.push("/(admin-web)/admin/staff");
        break;
      case "appointments":
        router.push("/(admin-web)/admin/appointments");
        break;
      default:
        break;
    }
  };

  if (loading && !metrics) {
    return <Loader fullScreen />;
  }

  return (
    <ScrollView 
      className="flex-1 max-w-3xl mx-auto w-full bg-canvas" 
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchMetrics} tintColor="#18181B" />
      }
    >
      <HeaderSection
        title="Dashboard"
        description="Clinic overview and today's activity."
      />

      <ServerTimeBanner serverTime={serverTime} loading={loading} />
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={() => onCardPress('appointments')}
        className="w-full p-5 rounded-xl mb-5 bg-surface border border-border"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <Text className="text-xs font-medium text-text-muted uppercase tracking-label mb-1">
              Today
            </Text>
            <Text className="text-2xl font-semibold text-text-primary">
              {metrics?.todayAppointments ?? 0} appointments
            </Text>
          </View>
          
          <View className="p-2.5 rounded-lg bg-surfaceMuted border border-border">
            <Svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2">
              <Path d={ICONS.calendar} />
            </Svg>
          </View>
        </View>
      </TouchableOpacity>

      {/* ─── GRID TITLE LINE ─── */}
      <View className="flex-row items-center gap-2 mb-4">
  <View className="flex-row items-center bg-surfaceMuted border border-border px-2.5 py-1 rounded-md">
    <View className="h-1.5 w-1.5 rounded-full bg-success mr-1.5" />
    <Text className="text-xs text-text-secondary">
      {metrics?.activeUsers ?? 0} / {(metrics?.totalCustomers ?? 0) + (metrics?.totalStaff ?? 0)} active
    </Text>
  </View>

  <View className="flex-row items-center bg-surfaceMuted border border-border px-2.5 py-1 rounded-md">
    <View className={`h-1.5 w-1.5 rounded-full mr-1.5 ${metrics?.todayUnbookedCount ? 'bg-warning' : 'bg-text-muted'}`} />
    <Text className="text-xs text-text-secondary">
      {metrics?.todayUnbookedCount ?? 0} open slots
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
          className="w-[48.5%] bg-surface p-4 rounded-xl border border-border justify-between min-h-[130px] mb-4"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-xs font-medium text-text-muted uppercase tracking-label flex-1 mr-1" numberOfLines={2}>
              Total Customers
            </Text>
            <View className="p-1.5 rounded-md bg-surfaceMuted border border-border">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2">
                <Path d={ICONS.users} />
              </Svg>
            </View>
          </View>
          <View className="mt-4">
            <Text className="text-2xl font-semibold text-text-primary">
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
          className="w-[48.5%] bg-surface p-4 rounded-xl border border-border justify-between min-h-[130px] mb-4"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-xs font-medium text-text-muted uppercase tracking-label flex-1 mr-1" numberOfLines={2}>
              Clinical Staff
            </Text>
            <View className="p-1.5 rounded-md bg-surfaceMuted border border-border">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2">
                <Path d={ICONS.briefcase} />
              </Svg>
            </View>
          </View>
          <View className="mt-4">
            <Text className="text-2xl font-semibold text-text-primary">
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
          className="w-[48.5%] bg-surface p-4 rounded-xl border border-border justify-between min-h-[130px] mb-4"
        >
          <View className="flex-row justify-between items-start">
            <Text className="text-xs font-medium text-text-muted uppercase tracking-label flex-1 mr-1" numberOfLines={2}>
              Vacant Hours
            </Text>
            <View className="p-1.5 rounded-md bg-surfaceMuted border border-border">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2">
                <Path d={ICONS.calendar} />
              </Svg>
            </View>
          </View>
          <View className="mt-4">
            <Text className="text-2xl font-semibold text-text-primary">
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
          className="w-[48.5%] bg-surface p-4 rounded-xl border border-border justify-between min-h-[130px] mb-4"
        >
          {/* Header Row: Title & Vector Graphic Icon Box */}
          <View className="flex-row justify-between items-start">
            <Text className="text-xs font-medium text-text-muted uppercase tracking-label flex-1 mr-1" numberOfLines={2}>
              Registered Pets
            </Text>
            <View className="p-1.5 rounded-md bg-surfaceMuted border border-border">
              <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2">
                <Path d={ICONS.paw} />
              </Svg>
            </View>
          </View>

          {/* Metric Counter & Sub-Label Status Indicator */}
          <View className="mt-4">
            <Text className="text-2xl font-semibold text-text-primary">
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

