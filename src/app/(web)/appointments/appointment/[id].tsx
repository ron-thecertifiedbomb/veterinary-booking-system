import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router, useLocalSearchParams } from "expo-router"; 
import { useEffect } from "react";

export default function AppointmentDetailedScreen() {
    const { token } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    
    const { id: appointmentId } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
     
        if (!token || !appointmentId) return;

        fetchAppointments({ appointmentId }); 
    }, [token, appointmentId, fetchAppointments]); 

    if (loading && !singleAppointment) {
        return <Loader fullScreen />;
    }

    return (
        <Container>
        <BackButton 
                onPress={() => router.back()} 
                className="mb-4 p-1" 
            />
            <AppointmentDetailCard appointment={singleAppointment}  />
        </Container>
    );
}
