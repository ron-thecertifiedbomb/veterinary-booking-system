import BookingSuccessModal from "@/components/booking/BookingSuccessModal";
import DateSelector from "@/components/booking/DateSelector";
import AppBookingModal from "@/components/common/AppModal/AppBookingModal";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import {
    CreateAppointmentPayload,
    CreateAppointmentResponse,
} from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getTodayDate } from "@/utils/appointments/formatter";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";


export default function Home() {

    const {
        fetchSlots,
        slots,
        currentDate,
        loading: slotsLoading,
    } = useGetSlots();

    const {
        createAppointment,
        loading: creating,
    } = useCreateAppointment();


    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const { user, refreshSession } = useAuth();
    const [bookingSummary, setBookingSummary] =
        useState<CreateAppointmentResponse | null>(null);
    const [successModalVisible, setSuccessModalVisible] =
        useState(false);

    const pets = user?.customerProfile?.pets ?? [];
    const redirected = useRef(false);

    useEffect(() => {
        if (!user || redirected.current) return;

        if (user.role === "CUSTOMER" && pets.length === 0) {
            redirected.current = true;

            if (Platform.OS === "web") {
                router.replace("/(web)/web-add-pet");
            } else {
                router.replace("/(app)/add-pet");
            }
        }
    }, [user, pets.length]);

  
    const handleSelectDate = async (newDate: string) => {
        setDate(newDate);
        setShowModal(true); 
        await fetchSlots(newDate); 
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSubmit = async (formData: CreateAppointmentPayload) => {
        try {
          
            if (creating) return;

            const response = await createAppointment(formData);
            setBookingSummary(response);
            setShowModal(false);
            setTimeout(() => {
            setSuccessModalVisible(true);
            }, 500); 
            refreshSession();

        } catch (err: any) {
            showAlert("Error", err?.message);
        }
    };

    return (
        <Container>
            <HeaderSection
                title="Book an Appointment"
            />

            {/* ✅ EMPTY STATE */}
            {pets.length === 0 ? (
                <EmptyState
                    title="No Registered Pet"
                    buttonLabel="Register your Pet"
                    onPress={() =>
                        router.replace(
                            Platform.OS === "web"
                                ? "/(web)/web-add-pet"
                                : "/(app)/add-pet"
                        )
                    }
                />
            ) : (
                <DateSelector
                    date={date}
                    onDateChange={handleSelectDate}
                />
            )}
            {pets.length > 0 && (
                <AppBookingModal
                    loading={slotsLoading || creating} // ✅ handled INSIDE modal
                    pets={pets}
                    slots={slots}
                    date={date}
                    visible={showModal}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                />
            )}
            <BookingSuccessModal
                visible={successModalVisible}
                items={bookingSummary}
                onClose={() => {
                    setSuccessModalVisible(false);
                    router.push(
                        Platform.OS === "web"
                            ? "/(web)/web-appointments"
                            : "(app)/(tabs)/appointments"
                    );
                }}
            />
        </Container>
    );
}
