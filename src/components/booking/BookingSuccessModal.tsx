import { CreateAppointmentResponse } from "@/features/appointment/types";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
    visible: boolean;
    data: any;
    onClose: () => void;
};

const formatDate = (iso?: string) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

export default function BookingSuccessModal({
    visible,
    data,
    onClose,
}: Props) {
    if (!visible || !data) return null;

    return (
        <View className="absolute inset-0 bg-black/70 justify-center items-center px-6 z-50">

            <View className="bg-white w-full max-w-md rounded-3xl p-6">

                {/* Header */}
                <Text className="text-2xl font-bold text-center mb-2">
                    Booking Confirmed
                </Text>

                <Text className="text-gray-500 text-center mb-6">
                    {data.message}
                </Text>

                {/* Divider */}
                <View className="border-t border-gray-200 mb-4" />

                {/* Details */}
                <View className="space-y-3 mb-6">

                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Status</Text>
                        <Text className="font-semibold">
                            {data.data.status}
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Reference</Text>
                        <Text className="font-semibold">
                            {data.data.bookingCode}
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Date</Text>
                        <Text className="font-semibold">
                            {formatDate(data.data.appointmentDate)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Time</Text>
                        <Text className="font-semibold">
                            {data.selectedTime}
                        </Text>
                    </View>

                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">Service</Text>
                        <Text className="font-semibold">
                            {data.data.serviceType}
                        </Text>
                    </View>

                </View>

                {/* Action */}
                <TouchableOpacity
                    onPress={onClose}
                    className="bg-black py-3 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold">
                        Back to Home
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
``