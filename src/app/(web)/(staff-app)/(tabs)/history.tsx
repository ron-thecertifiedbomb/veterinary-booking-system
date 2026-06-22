import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import { useGetStaffAppointments } from "@/features/appointment/hooks/useGetStaffAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, Platform, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {
  const { token } = useAuth();
  const { loading, isEmpty, appointments, fetchStaffAppointments } = useGetStaffAppointments();

  useEffect(() => {
    if (!token) return;
    fetchStaffAppointments();
  }, [token]);

 
  if (loading && isEmpty) {
    return <Loader fullScreen />;
  }
  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={['top']}>
        <View className="px-5 pt-4 pb-2">
        <Text className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
          Clinical File
        </Text>
        <Text className="text-xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
         My Appointments
        </Text>
      </View>

      
      <View className="flex-1 px-4">
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.bookingCode}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32,
            paddingTop: 8,
            flexGrow: 1, 
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          onRefresh={fetchStaffAppointments}
          refreshing={loading}
          
  
          ListEmptyComponent={
            !loading && isEmpty ? (
              <EmptyState
                title="No Assigned Appointments" 
              /> 
            ) : null
          }
          renderItem={({ item }) => (
            <AppointmentCard 
            appointments={item} 
            routerPath={`(staff-app)/appointment/${item.id}`} 
          />
        )}
        />
                </View>
    </SafeAreaView>
  );
}
