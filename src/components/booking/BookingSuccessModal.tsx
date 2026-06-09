import { Modal, View, Text, TouchableOpacity } from "react-native";
import { CreateAppointmentResponse } from "@/features/appointment/types/appointment";

type Props = {
    visible: boolean;
    items?: CreateAppointmentResponse | null;
    onClose: () => void;
};

function getStatusStyle(status: string) {
    switch (status) {
        case "APPROVED":
            return "bg-emerald-100 text-emerald-700";
        case "PENDING":
            return "bg-amber-100 text-amber-700";
        case "CANCELLED":
            return "bg-rose-100 text-rose-600";
        default:
            return "bg-gray-100 text-gray-600";
    }
}

export default function BookingSuccessModal({
    visible,
    items,
    onClose,
}: Props) {
    if (!items) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            {/* ✅ BACKDROP */}
            <View className="flex-1 bg-black/50 justify-center items-center px-4">

                {/* ✅ MODAL CARD */}
                <View className="bg-white w-full max-w-2xl rounded-3xl p-6">

                    {/* ✅ HEADER */}
                    <View className="items-center mb-6">
                        <Text className="text-2xl font-bold mb-1">
                            Booking Confirmed 
                        </Text>
                        <Text className="text-gray-500 text-center">
                            {items.message}
                        </Text>
                    </View>

                    {/* ✅ STATUS BADGE */}
                    <View className="items-center mb-6">
                        <View className={`px-4 py-1 rounded-full ${getStatusStyle(items.data.status)}`}>
                            <Text className="text-xs font-semibold">
                                {items.data.status}
                            </Text>
                        </View>
                    </View>

                    {/* ✅ GRID CONTENT */}
                    <View className="flex-row flex-wrap gap-y-4">

                        {/* LEFT COLUMN */}
                        <View className="w-1/2 pr-2 space-y-3">

                            <View>
                                <Text className="text-xs text-gray-500">Reference</Text>
                                <Text className="font-semibold">
                                    {items.data.bookingCode}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500">Booked On</Text>
                                <Text className="font-semibold">
                                    {items.data.bookedAt}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500">Service</Text>
                                <Text className="font-semibold">
                                    {items.data.serviceType}
                                </Text>
                            </View>

                        </View>

                        {/* RIGHT COLUMN */}
                        <View className="w-1/2 pl-2 space-y-3">

                            <View>
                                <Text className="text-xs text-gray-500">Date</Text>
                                <Text className="font-semibold">
                                    {items.data.appointmentDisplay?.date}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500">Time</Text>
                                <Text className="font-semibold">
                                    {items.data.appointmentDisplay?.time}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-xs text-gray-500">Reference Code</Text>
                                <Text className="font-semibold font-mono tracking-wider">
                                    {items.data.bookingCode}
                                </Text>
                            </View>

                        </View>

                    </View>

                    {/* ✅ DIVIDER */}
                    <View className="border-t border-gray-200 my-6" />

                    {/* ✅ ACTION BUTTON */}
                    <TouchableOpacity
                        onPress={onClose}
                        className="bg-black py-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold text-base">
                            Go to your Appointment
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}