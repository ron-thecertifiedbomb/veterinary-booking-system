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

  // Handle initialization loading state cleanly
  if (loading && isEmpty) {
    return <Loader fullScreen />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
      <View className="flex-1 px-4">
        <FlatList
          data={appointments}
          keyExtractor={(item) => item.bookingCode}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 32,
            paddingTop: 8,
            // Automatically fills screen height for clean empty-state layout centers
            flexGrow: 1, 
          }}
          ItemSeparatorComponent={() => <View className="h-4" />}
          onRefresh={fetchStaffAppointments}
          refreshing={loading}
          
          // ─── UTILIZED ISEMPTY RENDER FLAG ───
          ListEmptyComponent={
            !loading && isEmpty ? (
              <EmptyState
                title="No Assigned Appointments" 
              /> 
            ) : null
          }


          renderItem={({ item }) => (
            // Swapped plural mapping prop to singular for strict card layout sync
            <AppointmentCard appointment={item} />
          )}
        />
      </View>
    </SafeAreaView>
  );
}
