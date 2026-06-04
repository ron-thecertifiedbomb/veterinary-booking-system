import { Appointment } from "@/features/appointment/types/appointment";
import { Text, View } from "react-native";

type AppointmentCardProps = {
    item: Appointment;
};


export default function AppointmentCard({ item }: AppointmentCardProps) {
    return (
        <View
            className="bg-white rounded-2xl mb-4 p-5 border border-border"
            style={{
                boxShadow: "0px 8px 20px rgba(2,6,23,0.06)",
            }}
        >

            {/* TOP ROW */}
            <View className="flex-row justify-between items-center mb-3">
                <View>
                    <Text className="text-base font-semibold mb-[0.8px]">
                      Name: {item.pet?.petName}
                    </Text>
                    <Text className="text-sm opacity-70 font-semibold">
                       Service Type: {item.serviceType}
                    </Text>
                </View>

                <Text className="text-xs font-semibold opacity-70">
                   STATUS:  {item.status}
                </Text>
            </View>

            {/* SCHEDULE */}
            <Text className="text-sm font-semibold mb-[2px]">
              Appointment Schedule: 
            </Text>

            <Text className="text-xs font-semibold opacity-70 mb-2">
                {item.appointmentDisplay?.date} • {item.appointmentDisplay?.time}
            </Text>
            {/* FOOTER (CLEAN DETAILS) */}
            <View className="flex-row justify-between items-end">

                {/* LEFT: BOOKED */}
                <View>
                    <Text className="text-[10px] text-gray-400">
                        Booked on
                    </Text>
                    <Text className="text-xs text-gray-600">
                        {item.bookedAt}
                    </Text>
                </View>

                {/* RIGHT: REFERENCE */}
                <View className="items-end">
                    <Text className="text-[10px] text-gray-400">
                        Ref Code
                    </Text>
                    <Text className="text-xs font-mono tracking-wider text-gray-700">
                        {item.bookingCode}
                    </Text>
                </View>

            </View>
        </View>
    );
}