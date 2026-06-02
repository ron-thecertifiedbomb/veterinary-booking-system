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
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();

    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const [modalChecking, setModalChecking] = useState(false);

    const { user, refreshSession, updateUserAppointments } = useAuth();
    const pets = user?.pets || [];

    const {
        getSlots,
        slotsData,
        loading: slotsLoading,
        error: slotFetch,
    } = useGetSlots(date);

    const slots = slotsData?.slots ?? [];

    const {
        createAppointment,
        loading: creating,
        error: createError,
        success,
        resetSuccess,
    } = useCreateAppointment();

    const handleSelectDate = async (newDate: string) => {
        setModalChecking(true);
        setShowModal(true);
        setDate(newDate);
        await getSlots(newDate);
    };

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

    const handleCloseModal = () => {
        setShowModal(false);
        setModalChecking(false);
    };

    const handleSubmit = async (formData: any) => {
        if (!formData.time) return;

        try {
            const response = await createAppointment({
                petId: formData.petId,
                serviceType: formData.serviceType,
                appointmentDate:date,
                notes: formData.notes || "",
            });

            showAlert("Success", response.message);
            updateUserAppointments(response.data[0])
            handleCloseModal();
            setTimeout(() => {
                router.push({ pathname: "(web)/success" });
            }, 300);

        } catch (err: any) {
            showAlert(
                "Booking Failed",
                err?.message || "Something went wrong"
            );
        }
    };

    return (
        <Container>
            <HeaderSection
                title="Book an Appointment"
                description="Select date of appointment"
                date={date}
            />

            <DateSelector
                date={date}
                onDateChange={handleSelectDate}
            />

            {/* ✅ CLEAN MODAL USAGE */}
            <AppBookingModal
                pets={pets}
                slots={slots}
                date={date}
                creating={creating}
                visible={showModal}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
            />

            {/* ✅ LOADER FIX */}
            {(slotsLoading || modalChecking) && (
                <Loader fullScreen transparent />
            )}
        </Container>
    );
}
