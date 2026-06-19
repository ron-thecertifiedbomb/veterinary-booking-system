import { DateRangePicker } from "@/components/booking/DateRangePicker";
import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
// 1. Fixed missing structural imports for UI layout stability
import DateSelector from "@/components/booking/DateSelector"; // Adjust path as per project directory structure
import { useGetAllAppointments } from "@/features/admin/hooks/useGetAllAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Modal, Platform, Text, TouchableOpacity, View } from "react-native";

export default function AdminAppointments() {
    const { user } = useAuth(); 

    // Explicitly passes current role context directly down to custom core logic wrapper hook
    const { loading, isEmpty, appointments, fetchAllAppointments, filters, setFilters } = useGetAllAppointments({ 
        role: user?.role 
    });

    const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);
  

    if (loading && appointments.length === 0) {
        return <Loader fullScreen />;
    }

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/web-home" : "/(app)/(tabs)/home");
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
        <Container  className="flex-1 max-w-3xl mx-auto w-full" >
            <HeaderSection title="All Appointments" />
            
            <DateRangePicker
                fromValue={filters.from}
                toValue={filters.to}
                onPress={(type) => setActivePicker(type)}
            />

            <Modal
                visible={activePicker !== null}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setActivePicker(null)}
            >
                <View className="flex-1 justify-end bg-black/40">
                    <TouchableOpacity className="flex-1" onPress={() => setActivePicker(null)} />
                    <View className="bg-white dark:bg-zinc-900 rounded-t-3xl p-5 pb-8">
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-lg font-bold text-gray-900 dark:text-white">
                                Select {activePicker === "from" ? "Start" : "End"} Date
                            </Text>
                            <TouchableOpacity onPress={() => setActivePicker(null)}>
                                <Text className="text-blue-500 font-semibold">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        <DateSelector
                            date={(activePicker === "from" ? filters.from : filters.to) || ""}
                            onDateChange={handleDateSelection}
                        />
                    </View>
                </View>
            </Modal>
            
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
                        keyExtractor={(item) => item.bookingCode}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 32,
                            paddingTop: 8,
                        }}
                        onRefresh={fetchAllAppointments}
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
                        renderItem={({ item }) => (
                            <AppointmentCard 
                            appointments={item} 
                            routerPath={`/admin/appointments/${item.bookingCode}`} 
                          />
                        )}
                    />
                </View>
            )}
        </Container>
    );
}
