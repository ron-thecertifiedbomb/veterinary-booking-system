import BookingSuccessModal from "@/components/booking/BookingSuccessModal";
import DateSelector from "@/components/booking/DateSelector";
import AppBookingModal from "@/components/common/AppModal/AppBookingModal";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getTodayDate } from "@/utils/dateandtime/date";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

export default function Home() {

    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);
    const { user, refreshSession } = useAuth();
    const pets = user?.pets || [];
    const [bookingSummary, setBookingSummary] = useState<any>(null);
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    useEffect(() => {
        refreshSession();
    }, []);

    const {
        fetchSlots,
        slots,
        currentDate,
        loading: slotsLoading,
    } = useGetSlots();

    const {
        createAppointment,
        loading: creating,
        success,
        resetSuccess,
    } = useCreateAppointment();

    const handleSelectDate = async (newDate: string) => {
        setModalChecking(true);
        setShowModal(true);
        setDate(newDate);
        await fetchSlots(newDate);
    };
    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => resetSuccess(), 2500);
        return () => clearTimeout(timer);
    }, [success, resetSuccess]);

    useEffect(() => {
        if (!showModal || slotsLoading) return;
        setModalChecking(false);
    }, [showModal, slotsLoading]);

    const handleCloseModal = () => {
        setShowModal(false);
        setModalChecking(false);
    };


    const handleSubmit = async (formData: any) => {
        if (!formData.appointmentTime) return;
        try {
            const response = await createAppointment({
                petId: formData.petId,
                serviceType: formData.serviceType,
                appointmentDate: formData.appointmentDate,
                appointmentTime: formData.appointmentTime,
                notes: formData.notes || "",
            });
            setBookingSummary({
                ...response,
                selectedTime: formData.appointmentTime,
            });
            handleCloseModal();
            setSuccessModalVisible(true);

        } catch (err: any) {
            showAlert(
                "",
                err?.message
            );
        }
    };
    return (
        <Container>
            <HeaderSection
                title="Book an Appointment"
                description="Select date of appointment"
                date={currentDate}
            />
            <DateSelector
                date={date}
                onDateChange={handleSelectDate}
            />
            <AppBookingModal
                loading={slotsLoading || creating}
                pets={pets}
                slots={slots}
                date={date}
                creating={creating}
                visible={showModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />
            <BookingSuccessModal
                visible={successModalVisible}
                data={bookingSummary}
                onClose={() => {
                    setSuccessModalVisible(false);
                    if (Platform.OS === "web") {
                        router.push({ pathname: "(web)/web-home" });
                    } else {
                        router.push({ pathname: "(app)/(tabs)/home" });
                    }
                }}
            />
            {(slotsLoading || modalChecking) && (
                <Loader fullScreen transparent />
            )}
        </Container>
    );
}
