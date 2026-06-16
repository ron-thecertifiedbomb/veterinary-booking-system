import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router"; // 1. Added useLocalSearchParams
import { useEffect } from "react";

export default function AppointmentScreen() {

    const { token } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    
    const { id } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
        if (token) {
            fetchAppointments(id); 
        }
    }, [token, id]); 

    if (loading && !singleAppointment) {
        return <Loader fullScreen />;
    }

    return (
        <Container>
            <HeaderSection
                title={id ? "Appointment Details" : "My Appointments"}
             
            />
                    <AppointmentDetailCard appointment={singleAppointment} />
           
        </Container>
    );
}
