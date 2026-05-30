import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import Loader from "@/components/common/Loader/Loader";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getTodayDate } from "@/utils/dateandtime/date";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Home() {

    const router = useRouter();
    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const { user } = useAuth();
    const pets = user?.pets || [];
    const {
        slots,
        today: now,
        time,
        loading,
        error: fetchError,
    } = useGetSlots(date);

    const {
        createAppointment,
        loading: creating,
        error: createError,
        success,
        resetSuccess,
    } = useCreateAppointment();

    useEffect(() => {
        if (!loading) {
            setInitialLoading(false);
        }
    }, [loading]);

    useEffect(() => {
        if (!success) return;

        const timer = setTimeout(() => {
            resetSuccess();
        }, 2500);
        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    // ✅ Modal loading sync
    useEffect(() => {
        if (!showModal) return;
        if (loading) return;

        setModalChecking(false);
    }, [showModal, loading]);

    // ✅ Initial loader
    if (initialLoading) {
        return <Loader fullScreen />;
    }

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="items-center px-6 pb-10"
            keyboardShouldPersistTaps="handled"
        >
            <View className="w-full max-w-3xl pt-6 lg:p-14">

                <View className="mb-6">
                    <Text className="text-lg lg:text-3xl font-semibold text-text-primary">
                        Book an Appointment
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        Select a service and choose your preferred schedule.
                    </Text>
                </View>

                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Today is
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {now}
                    </Text>

                    <Text className="text-xs text-text-secondary mt-1">
                        {time}
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

            {/* ✅ BOOKING MODAL */}
            <BookingModal
                pets={pets}
                visible={showModal}
                slots={slots}
                checking={modalChecking || loading}
                creating={creating}
                error={fetchError || createError}
                date={date}
                timeDisplay={time ?? ""}
                onClose={() => {
                    setShowModal(false);
                    setModalChecking(false);
                }}

                onSubmit={async (formData) => {
                    if (!formData.time) return;

                    try {
                        const appointment = await createAppointment({
                            petId: formData.petId,
                            petName: formData.petName, 
                            serviceType: formData.serviceType,
                            time: formData.time,
                            date,
                            notes: formData.notes || "",
                        });

                        showAlert(
                            "Success",
                            appointment.message
                        );

                        setShowModal(false);
                        setModalChecking(false);

                        setTimeout(() => {
                            router.push({
                                pathname: "(web)/success",
                            });
                        }, 300);

                    } catch (err: any) {
                        showAlert(
                            "Booking Failed",
                            err?.message || "Something went wrong"
                        );
                    }
                }}
            />
        </ScrollView>
    );
}