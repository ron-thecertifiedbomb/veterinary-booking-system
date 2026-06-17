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
            {/* ─── PREMIUM ALIGNED HEADER ROW ─── */}
            <View className="w-full flex-row items-center justify-between mb-6 px-4">
                <View className="flex-row items-center space-x-3 flex-1">
                    <BackButton 
                        webRoute="/(web)/appointments" 
                        appRoute="(app)/(tabs)/appointments" 
                        className="m-0 p-1" // Strip extra margins to align cleanly with text
                    />
                    {/* <View className="flex-1 pt-1.5"> 
                        <HeaderSection
                            title={id ? "Appointment Details" : "My Appointments"}
                  
                        />
                    </View> */}
                </View>
            </View>

            {/* ─── MAIN CONTENT BLOCK ─── */}
            <View className="px-4">
                <AppointmentDetailCard appointment={singleAppointment} />
            </View>
        </Container>
    );
}
