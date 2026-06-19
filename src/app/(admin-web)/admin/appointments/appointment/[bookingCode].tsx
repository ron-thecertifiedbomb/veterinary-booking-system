import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router"; 
import { useEffect } from "react";
import { View } from "react-native";

export default function AdminAppointmentDetailedScreen() {
    const { token } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    const { bookingCode } = useLocalSearchParams<{ bookingCode?: string }>();
    
    console.log('booking', bookingCode);

    useEffect(() => {
        // Guard clause: stop execution if either required value is missing
        if (!bookingCode || !token) return;

        // FIX: Pass undefined for appointmentId so bookingCode hits the 2nd parameter slot
        fetchAppointments({ bookingCode }); 
    }, [token, bookingCode, fetchAppointments]); // Added fetchAppointments to dependency array

    if (loading && !singleAppointment) {
        return <Loader fullScreen />;
    }

    return (
        <Container>
            <BackButton 
                webRoute="/admin/appointments" 
                className="mb-4 p-1" 
            />
            <AppointmentDetailCard appointment={singleAppointment} />
        </Container>
    );
}
