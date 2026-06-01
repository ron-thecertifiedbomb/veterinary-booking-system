import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import Loader from "@/components/common/Loader/Loader";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { formatTime, getTodayDate } from "@/utils/dateandtime/date";
import { formatPHDate, formatter } from "@/utils/dateandtime/time";
import { formatDate } from "date-fns";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
    const router = useRouter();
    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);
    const { user, loading: authLoading, refreshSession } = useAuth();
    const pets = user?.pets || [];

    const { getSlots, slotsData,
        loading: slotsLoading,
        error: slotFetch, } = useGetSlots(date);

    const slots = slotsData?.slots ?? [];
    const now = slotsData?.meta.currentDateTime.date ?? "";
    const time = slotsData?.meta.currentDateTime.time ?? "";


    
    const handleSelectDate = async (newDate: string) => {
        setModalChecking(true);
        setShowModal(true);
        setDate(newDate);

        await getSlots(newDate);
    };
    const {
        createAppointment,
        loading: creating,
        error: createError,
        success,
        resetSuccess,
    } = useCreateAppointment();

    useEffect(() => {
        refreshSession();
    }, []);

    useEffect(() => {
        getSlots();
    }, [date]);

    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => resetSuccess(), 2500);
        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    useEffect(() => {
        if (!showModal || slotsLoading) return;
        setModalChecking(false);
    }, [showModal, slotsLoading]);

    // ✅ only block on initial auth load

    if (slotsLoading) {
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
                        {formatter(time)}
                    </Text>
                </View>

                <DateSelector
                    date={date}
                    onDateChange={handleSelectDate}
                />

            </View>
            <BookingModal
                pets={pets}
                visible={showModal}
                slots={slots}
                checking={modalChecking || slotsLoading}
                creating={creating}
                error={slotFetch || createError}
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
                            router.push({ pathname: "(web)/success" });
                        }, 300);

                    } catch (err: any) {
                        showAlert("Booking Failed", err?.message || "Something went wrong");
                    }
                }}
            />
        </ScrollView>
    );
}