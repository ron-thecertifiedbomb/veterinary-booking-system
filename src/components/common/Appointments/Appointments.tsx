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

    const { token } = useAuth(); 
    const { loading, isEmpty, appointments, fetchAppointments, filters, setFilters } = useGetAppointments();
    const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);
  
    useEffect(() => {
        if (token) {
            fetchAppointments();
        }
    }, [token, filters]);

    if (loading && appointments.length === 0) {
        return <Loader fullScreen />;
    }

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        // REMOVED Route Groups: Changed `/(web)/web-home` to `/web-home` and `/(app)/(tabs)/home` to `/home`
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
                        onRefresh={fetchAppointments}
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
                            // Explicit Web layout URL string
                            const webPath = `/appointments/appointment/${item.id}`;
  
                            // Correct Mobile path: strips out '(app)' and '(tabs)' 
                            // Matches your structural file layout: app/(app)/(tabs)/appointment/[id].tsx
                            const mobilePath = `
                            /(app)/appointment/${item.id}`; 

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
