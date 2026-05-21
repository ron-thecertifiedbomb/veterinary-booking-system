import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DateSelector from "@/components/booking/DateSelector";
import BookingModal from "@/components/booking/BookingModal";

import { getTodayDate } from "@/utils/date";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useBookingBootstrap } from "@/hooks/useBookingBootstrap";

export default function Home() {
    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);

    const { slots, loading } = useBookingBootstrap(date);

    const {
        createBooking,
        error,
        success,
        resetSuccess,
    } = useCreateBooking();

    useEffect(() => {
        if (!success) return;

        const timer = setTimeout(() => {
            resetSuccess();
        }, 2500);

        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    useEffect(() => {
        if (!showModal) return;
        if (loading) return;

        setModalChecking(false);
    }, [showModal, loading]);

    if (loading && !showModal) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <Text className="text-text-secondary">
                    Loading...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            {success && (
                <View className="absolute top-10 left-0 right-0 items-center z-50">
                    <View className="bg-green-500 px-4 py-3 rounded-xl shadow">
                        <Text className="text-white font-medium">
                            Booking successful!
                        </Text>
                    </View>
                </View>
            )}

            <View className="max-w-md mx-auto w-full px-6 py-10">
                <DateSelector
                    date={date}
                    onDateChange={(newDate) => {
                        setModalChecking(true);
                        setShowModal(true);
                        setDate(newDate);
                    }}
                />
            </View>

            <BookingModal
                visible={showModal}
                slots={slots}
                checking={modalChecking || loading}
                onClose={() => {
                    setShowModal(false);
                    setModalChecking(false);
                }}
                onSubmit={async (data) => {
                    await createBooking({
                        ...data,
                        date,
                    });

                    setShowModal(false);
                    setModalChecking(false);
                }}
            />

            {error && (
                <View className="absolute bottom-10 left-0 right-0 items-center">
                    <Text className="text-red-500">
                        {error}
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}