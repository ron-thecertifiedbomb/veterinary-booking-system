
import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router"; // 1. Added useLocalSearchParams
import { useEffect } from "react";
import { View } from "react-native";

export default function AppointmentScreen() {
    const { token } = useAuth(); 
    const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
    
    // 2. Extract the dynamic "id" parameter from the active route route string
    const { id } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
        if (token) {
            // 3. If an ID is present in the URL path, pass it to target a single item
            fetchAppointments(id); 
        }
    }, [token, id]); // Re-run if the target route ID parameter shifts

    // 4. Fixed brackets and loading check syntax rules
    if (loading && !singleAppointment) {
        return <Loader fullScreen />;
    }

    return (
        <Container>
            <View className="w-full flex flex-row justify-center px-10">
            <HeaderSection
                title={id ? "Appointment Details" : "My Appointments"}
            />
             <BackButton webRoute="/(web)/appointments" appRoute="(app)/(tabs)/appointments" /> 
             </View>
                    <AppointmentDetailCard appointment={singleAppointment} />
           
        </Container>
    );
}
