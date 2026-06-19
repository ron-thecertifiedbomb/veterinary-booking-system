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
    const { token, user } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    const { bookingCode } = useLocalSearchParams<{ bookingCode?: string }>();
    const role = user?.role;
    
console.log('role', role)

    useEffect(() => {
        // Guard clause: stop execution if vital values or parameters are absent
        if (!token || !role) return;

        // FIX: Pass bookingCode directly inside the structured payload configuration object
        fetchAppointments({ bookingCode }); 
    }, [token, bookingCode, role, fetchAppointments]); // FIX: Added missing role to the dependency array

    if (loading && !singleAppointment) {
        return <Loader fullScreen />;
    }

    return (
        <Container className="flex-1 max-w-3xl mx-auto w-full">
            <BackButton 
                webRoute="/admin/appointments" 
                className="mb-4 p-1" 
            />
            <AppointmentDetailCard appointment={singleAppointment} />
        </Container>
    );
}
