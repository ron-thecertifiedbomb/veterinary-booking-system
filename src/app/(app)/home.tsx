import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateSelector from "@/components/booking/DateSelector";
import BookingModal from "@/components/booking/BookingModal";
import { createBooking } from "@/features/booking/api";
import { getTodayDate } from "@/utils/date";
import { useBookingBootstrap } from "@/hooks/useBookingBootstrap ";



export default function Home() {
    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);

    const { slots, loading } = useBookingBootstrap(date);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="max-w-md mx-auto w-full px-6 py-10">
                <DateSelector
                    date={date}
                    onDateChange={setDate}
                    onContinue={() => setShowModal(true)}
                />
            </View>

            <BookingModal
                visible={showModal}
                slots={slots}
                onClose={() => setShowModal(false)}
                onSubmit={async (data) => {
                    await createBooking({ ...data, date });
                }}
            />
        </SafeAreaView>
    );
}
