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
import { useGetAllPets } from "@/features/pet/hooks/useGetAllPets";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getTodayDate } from "@/utils/appointments/formatter";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Loader from "../Loader/Loader";


export default function Home() {
    const [date, setDate] = useState(getTodayDate());

    const [showModal, setShowModal] = useState(false);
    const { user, token, refreshSession} = useAuth();

    const [bookingSummary, setBookingSummary] = useState<CreateAppointmentResponse | null>(null);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const redirected = useRef(false);
    
    const { fetchSlots, slots, loading: slotsLoading } = useGetSlots();
    const { createAppointment, loading: creating } = useCreateAppointment();
    const { fetchPets, loading: petsLoading, pets } = useGetAllPets();


useEffect(() => {
    refreshSession();
}, []); // Empty array = strictly runs once

// 2. Listen for Auth: Fetch pets ONLY when the user is ready
useEffect(() => {
    // If no user/token, OR if we already fetched the pets, stop here.
    if (!user || !token || initialFetchDone) {
        return;
    }

    const loadPets = async () => {
        await fetchPets(); 
        setInitialFetchDone(true); 
    };

    loadPets();

}, [user, token, initialFetchDone]);

    // Redirect if no pets
    useEffect(() => {
        if (!user || petsLoading || !initialFetchDone || redirected.current) return;

        if (user.role === "CUSTOMER" && pets.length === 0) {
            redirected.current = true;
            if (Platform.OS === "web") {
                router.replace("/(web)/pets/add");
            } else {
                router.replace("/(app)/pets/add");
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

    if ( (petsLoading && !initialFetchDone)) {
        return <Loader fullScreen />;
    }

    return (
        <Container>
            <HeaderSection title="Book an Appointment" />

            {/* Hide the EmptyState until the initial fetch is actually done */}
            {!initialFetchDone ? null : pets.length === 0 ? (
                <EmptyState
                    title="No Registered Pet"
                    buttonLabel="Register your Pet"
                    onPress={() =>
                        // ✅ FIX 2: Matched these paths to the ones used in the useEffect!
                        router.replace(
                            Platform.OS === "web"
                                ? "/(web)/pets/add" 
                                : "/(app)/pets/add"
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