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

export default function AppointmentScreen() {
    const { token } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    const { id } = useLocalSearchParams<{ id?: string }>();
console.log('id', id)
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
                    <BackButton 
                        webRoute="/(web)/appointments" 
                        appRoute="(app)/(tabs)/appointments" 
                        className="mb-4 p-1" // Strip extra margins to align cleanly with text
                    />
                <AppointmentDetailCard appointment={singleAppointment} />
        </Container>
    );
}
