import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Platform, View } from "react-native";

export default function Appointments() {
    // FIX 1: Extract 'user' context so the frontend can pull down dynamic user roles
    const { token, user } = useAuth(); 
    const { loading, isEmpty, appointments, fetchAppointments, filters, setFilters } = useGetAppointments();
    const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);
  
    const role = user?.role;

    // FIX 2: Added 'role' to dependency array and wrapped options to match FetchAppointmentsOptions schema
    useEffect(() => {
        if (token && role) {
            fetchAppointments({ filters, role });
        }
    }, [token, filters, role, fetchAppointments]); // Stable and safe from infinite re-render cycles

    if (loading && appointments.length === 0) {
        return <Loader fullScreen />;
    }

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/web-home" : "/home");
    };

    const handleDateSelection = (selectedDate: string) => {
        if (activePicker === "from") {
            setFilters(prev => ({ ...prev, from: selectedDate }));
        } else if (activePicker === "to") {
            setFilters(prev => ({ ...prev, to: selectedDate }));
        }
        setActivePicker(null); 
    };

    return (
        <Container>
            <HeaderSection title="My Appointments" />
            
            {isEmpty && !loading ? (
                <EmptyState
                    title="No Appointments found"
                    buttonLabel="Book an Appointment"
                    onPress={handleAddAppointment}
                />
            ) : (
                <View className="flex-1">
                    <FlatList
                        data={appointments}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 32,
                            paddingTop: 8,
                        }}
                        // FIX 3: Ensure pull-to-refresh correctly maintains active parameters
                        onRefresh={() => fetchAppointments({ filters, role })}
                        refreshing={loading}
                        ListFooterComponent={
                            loading ? (
                                <View className="py-4">
                                    <Loader />
                                </View>
                            ) : (
                                <View style={{ height: 40 }} />
                            )
                        }
                        renderItem={({ item }) => {
                            const webPath = `/appointments/appointment/${item.id}`;
                            // Cleaned up line-break string whitespace mismatch formatting 
                            const mobilePath = `/(app)/appointment/${item.id}`; 

                            return (
                                <AppointmentCard 
                                    appointments={item} 
                                    routerPath={Platform.OS === 'web' ? webPath : mobilePath} 
                                />
                            );
                        }}
                    />
                </View>
            )}
        </Container>
    );
}
