import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Platform } from "react-native";
import DateSelector from "@/components/booking/DateSelector";
import BookingModal from "@/components/booking/BookingModal";
import { formatDate, getTodayDate } from "@/utils/date";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useBookingBootstrap } from "@/hooks/useBookingBootstrap";

export default function Home() {
    const router = useRouter();

    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);

    const { slots, loading } = useBookingBootstrap(date);

    const {
        createBooking,
        loading: creating,
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
            <View className="flex-1 justify-center items-center bg-background px-6">
                <Text className="text-sm text-text-secondary">
                    Loading appointments...
                </Text>
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="w-full max-w-md mx-auto px-6 pt-8 pb-10">

                <View className="mb-6">
                    <Text className="text-2xl font-semibold text-text-primary">
                        Book Appointment
                    </Text>

                    <Text className="text-sm leading-5 text-text-secondary mt-1.5">
                        Select a date to schedule your pet’s visit.
                    </Text>
                </View>

                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] text-text-muted uppercase tracking-wide mb-1.5">
                        Selected Date
                    </Text>

                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>
                </View>

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
                creating={creating}
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

                    const successPath =
                        Platform.OS === "web"
                            ? "/(web)/booking-success"
                            : "/(app)/booking-success";

                    router.push({
                        pathname: successPath,
                        params: {
                            ownerName: data.ownerName,
                            petName: data.petName,
                            serviceType: data.serviceType,
                            date,
                            time: data.time,
                        },
                    });

                }}
            />

            {error && (
                <View className="absolute bottom-10 left-0 right-0 items-center px-6">
                    <View className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                        <Text className="text-red-600 text-sm">
                            {error}
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
}