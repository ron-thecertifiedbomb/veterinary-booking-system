import { AppointmentHistoryItem } from "@/features/appointment/types/appointment";
import { formatAppointmentSchedule } from "@/utils/appointments/dateandtime/formatter";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

type AppointmentCardProps = {
    appointments: AppointmentHistoryItem;
};

export default function AppointmentCard({ appointments }: AppointmentCardProps) {
    return (
        <Pressable
            onPress={() => router.push(`/appointment/${appointments.id}`)}
            style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
            className="bg-white rounded-2xl mb-4 p-5 border border-gray-100"
        >
            {/* ✅ TOP ROW */}
            <View className="flex-row justify-between items-start mb-4">
                {/* LEFT */}
                <View>
                    <Text className="text-base font-semibold text-gray-900">
                        {appointments.pet?.petName}
                    </Text>

                    <Text className="text-sm text-gray-500 mt-1">
                        {appointments.serviceType}
                    </Text>
                </View>

                {/* ✅ STATUS BADGE */}
                <View className="px-3 py-1 rounded-full bg-gray-100 mr-2">
                    <Text className="text-xs font-medium text-gray-700">
                        {appointments.status}
                    </Text>
                </View>
            </View>

            {/* ✅ SCHEDULE */}
            <View className="mb-4">
                <Text className="text-xs text-gray-400 mb-1">
                    Appointment Schedule
                </Text>

                <Text className="text-sm font-medium text-gray-800">
                    {formatAppointmentSchedule(appointments.appointmentDate)} 
                  
                </Text>
            </View>

            {/* ✅ FOOTER */}
            <View className="flex-row justify-between items-end">
                <View>
                    <Text className="text-[10px] text-gray-400">
                        Booked on
                    </Text>
                    <Text className="text-xs text-gray-600">
                        {appointments.createdAt}
                    </Text>
                </View>

                <View className="items-end">
                    <Text className="text-[10px] text-gray-400">
                        Ref Code
                    </Text>
                    <Text className="text-xs font-mono tracking-wider text-gray-800">
                        {appointments.bookingCode}
                    </Text>
                </View>
            </View>

            {/* ✅ OPTIONAL VISUAL HINT (arrow) */}
            <View className="absolute right-4 top-4">
                <Text className="text-gray-300 text-lg">›</Text>
            </View>
        </Pressable>
    );
}