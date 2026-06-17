import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Linking, Platform } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import Loader from '@/components/common/Loader/Loader';
import EmptyState from '@/components/common/EmptyState/EmptyState';
import { useGetPatient } from '@/features/staff/hook/useGetPatient';

// ─── MINIMALIST ICON SET (VECTORS) ───
const ICONS = {
  paw: "M12 14a3 3 0 100-6 3 3 0 000 6zm-7-2a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zm14 0a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM12 6a2 2 0 110-4 2 2 0 010 4z",
  owner: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  phone: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.47-5.112-3.758-6.582-6.582l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.75z",
  email: "M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18M2.25 13.5a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25h19.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25M2.25 13.5L12 5.25l9.75 8.25",
  folder: "M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-19.5 0A2.25 2.25 0 000 15v5.25A2.25 2.25 0 002.25 22.5h19.5a2.25 2.25 0 002.25-2.25V15a2.25 2.25 0 00-2.25-2.25m-19.5 0h19.5"
};

export default function AssignedPatientsScreen() {
  const { fetchPatient, patients, loading, isEmpty } = useGetPatient();

  useEffect(() => {
    fetchPatient();
  }, []);

  const handleCall = (phoneNumber: string) => {
    if (phoneNumber) Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string, petName: string) => {
    if (email) Linking.openURL(`mailto:${email}?subject=Clinic Update regarding ${petName}`);
  };

  const handleViewMedicalHistory = (petId: string) => {
    console.log(`Open extensive record schema pipeline for: ${petId}`);
  };

  if (loading && isEmpty) {
    return <Loader fullScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={['top']}>
      {/* ─── HEADER TITLE BLOCK ─── */}
      <View className="px-5 pt-4 pb-2">
        <Text className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
          Clinical File
        </Text>
        <Text className="text-xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Assigned Patients
        </Text>
      </View>

      {/* ─── LIST CONTAINER VIEW ─── */}
      <FlatList
        data={patients}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 40, flexGrow: 1 }}
        onRefresh={fetchPatient}
        refreshing={loading}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <EmptyState
            title="Clear Caseload"
            buttonLabel="Refresh System"
            onPress={fetchPatient}
          />
        }
        renderItem={({ item }) => {
          const formattedWeight = item.weight ? `${(item.weight / 10).toFixed(1)} kg` : 'N/A';
          const hasPhone = !!item.customer?.user?.phone;
          const hasEmail = !!item.customer?.user?.email;

          return (
            <View className="bg-white dark:bg-zinc-900 rounded-[28px] p-5 border border-zinc-200/60 dark:border-zinc-800/80 shadow-xs">
              
              {/* ─── TOP SECTION: PATIENT OVERVIEW CARD ─── */}
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-row items-center flex-1 mr-2">
             
                  <View className="flex-1">
                    <Text className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50" numberOfLines={1}>
                       Name: {item.petName}
                    </Text>
                    <Text className="text-xs text-zinc-400 dark:text-zinc-500 font-medium mt-0.5">
                      {item.breed} • {item.species}
                    </Text>
                  </View>
                </View>

           
              </View>

              <View className="h-[1px] bg-zinc-100 dark:bg-zinc-800/60 my-1" />

              {/* ─── MID SECTION: OWNER INFORMATION HUD ─── */}
              <View className="py-3">
                <View className="flex-row items-center mb-2 gap-2">
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400 mr-2">
                    <Path d={ICONS.owner} />
                  </Svg>
                  <Text className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                    Client File
                  </Text>
                </View>

                {/* Fixed blank component variable assignment error from snippet */}
                <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200 px-6 mb-4">
                  {item.customer?.user?.name || "Unknown Client"}
                </Text>

                {/* ─── MOBILE FIRST BUTTONS PLATFORM ─── */}
                {/* Replaced absolute padding layout offsets with 50/50 flex splits to increase mobile tap targets */}
                <View className="flex-row items-center justify-between w-full  gap-4">
                  {hasPhone && (
                    <TouchableOpacity 
                      onPress={() => handleCall(item.customer.user.phone)}
                     className="flex-1 gap-4 flex-row items-center justify-center bg-zinc-100 dark:bg-zinc-800  rounded-xl border border-zinc-200/40 dark:border-zinc-700/30 min-h-[44px]"
                    >
                      <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-700 dark:text-zinc-300 mr-2">
                        <Path d={ICONS.phone} />
                      </Svg>
                      <Text className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Call Client</Text>
                    </TouchableOpacity>
                  )}

                  {hasEmail && (
                    <TouchableOpacity 
                      onPress={() => handleEmail(item.customer.user.email, item.petName)}
                      className="flex-1 gap-4 flex-row items-center justify-center bg-zinc-100 dark:bg-zinc-800  rounded-xl border border-zinc-200/40 dark:border-zinc-700/30 min-h-[44px]"
                    >
                      <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-700 dark:text-zinc-300 mr-2">
                        <Path d={ICONS.email} />
                      </Svg>
                      <Text className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Email</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              {/* ─── BASE FOOTER BLOCK: ASSIGNED CASES COUNTER ─── */}
              <View className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <View className="h-1.5 w-1.5 rounded-full bg-amber-500 mr-2" />
                  <Text className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    {item.appointmentIds?.length || 0} Connected Case Files
                  </Text>
                </View>

                <TouchableOpacity 
                  onPress={() => handleViewMedicalHistory(item.id)}
                  className="flex-row items-center py-1.5"
                  activeOpacity={0.7}
                >
                  <Text className="text-xs font-bold text-blue-500 dark:text-blue-400 mr-1">
                    Open Records
                  </Text>
                  <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-blue-500 dark:text-blue-400">
                    <Path d="M9 5l7 7-7 7" />
                  </Svg>
                </TouchableOpacity>
              </View>

            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
