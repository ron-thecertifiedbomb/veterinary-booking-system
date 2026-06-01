import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import {  getTodayDate } from "@/utils/dateandtime/date";
import { formatter } from "@/utils/dateandtime/time";
import { useRouter } from "expo-router";
import { useEffect,  useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Home() {

    const router = useRouter();
    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);
    const { user, refreshSession } = useAuth();
    
    const pets = user?.pets || [];

    const { getSlots, slotsData,
        loading: slotsLoading,
        error: slotFetch, } = useGetSlots(date);
    const slots = slotsData?.slots ?? [];
    const now = slotsData?.meta.currentDateTime.date ?? "";
    const time = slotsData?.meta.currentDateTime.time;

    console.log("time", time)

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
        if (!success) return;
        const timer = setTimeout(() => resetSuccess(), 2500);
        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    useEffect(() => {
        if (!showModal || slotsLoading) return;
        setModalChecking(false);
    }, [showModal, slotsLoading]);

    // ✅ only block on initial auth load


    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="items-center px-6 pb-10 pt-6 lg:pt-14"
            keyboardShouldPersistTaps="handled"
        >
      
            <View className="w-full max-w-3xl">
                <HeaderSection
                    title="Book an Appointment"
                    description="Select date of appointment"
                    date={date}
           
                />
                <DateSelector
                    date={date}
                    onDateChange={handleSelectDate}
                />

            </View>
            {slotsLoading ? <Loader fullScreen /> : null}
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