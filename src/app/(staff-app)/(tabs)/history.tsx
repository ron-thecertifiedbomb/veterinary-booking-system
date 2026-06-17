import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Loader from "@/components/common/Loader/Loader";
import { useGetStaffAppointments } from "@/features/appointment/hooks/useGetStaffAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {

const {token, user } = useAuth()
const {loading, appointments, fetchStaffAppointments} = useGetStaffAppointments()

useEffect(() => {

    if (!token) {
      return
    }
    fetchStaffAppointments();
  }, [token]);


    return (
        <SafeAreaView className="flex-1 bg-background">
             <View className="flex-1 px-2">
                    <FlatList
                        data={appointments}
                        keyExtractor={(item) => item.bookingCode}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 32,
                            paddingTop: 8,
                        }}
                        onRefresh={fetchStaffAppointments}
                        refreshing={loading}
    
                        renderItem={({ item }) => (
                            <AppointmentCard appointments={item} />
                        )}
                    />
                </View>
        </SafeAreaView>
    );
}