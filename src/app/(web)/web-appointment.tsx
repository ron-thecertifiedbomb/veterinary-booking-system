import { DateRangePicker } from "@/components/booking/DateRangePicker";
import DateSelector from "@/components/booking/DateSelector";
import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router, useLocalSearchParams } from "expo-router"; // 1. Added useLocalSearchParams
import { useEffect } from "react";
import { View } from "react-native";

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
