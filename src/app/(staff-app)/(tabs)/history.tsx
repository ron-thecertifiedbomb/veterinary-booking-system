import { useGetStaffAppointments } from "@/features/appointment/hooks/useGetStaffAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function History() {

const {token, user } = useAuth()
const {loading, fetchStaffAppointments , setFilters} = useGetStaffAppointments()

useEffect(() => {
    if (!token) {
      return
    }
    fetchStaffAppointments();
  }, [token]);


    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <Text className="text-lg font-semibold mb-2">
            History
            </Text>
        </SafeAreaView>
    );
}