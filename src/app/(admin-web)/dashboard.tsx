import { useGetAllAppointments } from "@/features/admin/hooks/useGetAllAppointments";
import { useEffect } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AdminDashboard() {


const {fetchAllAppointments, setFilters} = useGetAllAppointments()

useEffect(() => {
    setFilters({
        from: "2026-06-17",
        to: "2026-06-17",
        sortBy: "appointmentDate",
        sortOrder: "desc",
      })
    fetchAllAppointments()
}, [])

    return (
        <SafeAreaView className="flex-1 bg-background justify-center items-center px-6">
            <Text className="text-lg font-semibold mb-2">
                Dashboard
            </Text>
        </SafeAreaView>
    );
}