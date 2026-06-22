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
import { useGetPets } from "@/features/pet/hooks/useGetPet";

import { showAlert } from "@/hooks/crossPlatformAlert";
import { getTodayDate } from "@/utils/appointments/formatter";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";


export default function Home() {

    const [date, setDate] = useState(getTodayDate());
    const [showModal, setShowModal] = useState(false);
    const { user, refreshSession } = useAuth();
    const [bookingSummary, setBookingSummary] =
        useState<CreateAppointmentResponse | null>(null);
    const [successModalVisible, setSuccessModalVisible] =
        useState(false);
    const {
        fetchSlots,
        slots,
        currentDate,
        loading: slotsLoading,
    } = useGetSlots();

    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const redirected = useRef(false);

    const {
        createAppointment,
        loading: creating,
    } = useCreateAppointment();

    // 1. Rename loading to petsLoading
    const { fetchPets, loading: petsLoading, pets } = useGetPets();

 
    // 3. Update initial fetch to set initialFetchDone when complete
    useEffect(() => {
        const loadPets = async () => {
            await fetchPets(); 
            setInitialFetchDone(true); 
        };
        
        loadPets();
    }, []);

    // 4. Update the redirect logic to respect initialFetchDone and petsLoading
    useEffect(() => {
        // Wait until we have a user, OR the pets are actively fetching, OR the initial fetch hasn't finished yet!
        if (!user || petsLoading || !initialFetchDone || redirected.current) return;

        // Once initialFetchDone is TRUE, it's finally safe to check the length
        if (user.role === "CUSTOMER" && pets.length === 0) {
            redirected.current = true;

            if (Platform.OS === "web") {
                router.replace("/(web)/pets/add");
            } else {
                router.replace("/(app)/add-pet");
            }
        }
    }, [user, pets, petsLoading, initialFetchDone]); 

  
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
            
            // Note: setTimeout used to prevent iOS modal transition overlaps
            setTimeout(() => {
                setSuccessModalVisible(true);
            }, 500); 
            refreshSession();

        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
            showAlert("Error", errorMessage);
        }
    };

    return (
        <Container>
            <HeaderSection
                title="Book an Appointment"
            />

            {/* 5. Hide the EmptyState (or show a loader) until the initial fetch is actually done */}
            {petsLoading || !initialFetchDone ? null : pets.length === 0 ? (
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
                    loading={slotsLoading || creating}
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