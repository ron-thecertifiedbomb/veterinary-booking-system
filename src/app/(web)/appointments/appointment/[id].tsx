import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router"; 
import { useEffect } from "react";

export default function AppointmentDetailedScreen() {
    const { token } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    
    // FIX: Read 'id' from the URL parameters and alias it to 'appointmentId'
    const { id: appointmentId } = useLocalSearchParams<{ id?: string }>();

    console.log('Resolved appointmentId:', appointmentId);

    useEffect(() => {
        // Guard check: Exit early if the token or parameter is missing from the router state
        if (!token || !appointmentId) return;

        fetchAppointments({ appointmentId }); 
    }, [token, appointmentId, fetchAppointments]); 

    if (loading && !singleAppointment) {
        return <Loader fullScreen />;
    }

    return (
        <Container>
            <BackButton 
                webRoute="(web)/appointments" 
                appRoute="(app)/(tabs)/appointments" 
                className="mb-4 p-1" 
            />
            <AppointmentDetailCard appointment={singleAppointment} />
        </Container>
    );
}
