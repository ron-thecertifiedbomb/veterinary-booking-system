import { DateRangePicker } from "@/components/booking/DateRangePicker";
import DateSelector from "@/components/booking/DateSelector";
import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View, Modal } from "react-native";

export default function Appointments() {

    const { token } = useAuth(); 
    const { loading, isEmpty, appointments, fetchAppointments, filters, setFilters } = useGetAppointments();
    const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);
  
    useEffect(() => {
        if (token) {
            fetchAppointments();
        }
    }, [token,filters]);


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
        <Container>
            <HeaderSection
                title="My Appointments"
             
            />
            {/* <DateRangePicker
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
            </Modal> */}
            
            {isEmpty && !loading ? (
                <EmptyState
                    title="No appointments found"
                    description="Try adjusting your range or book a new one."
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
                        renderItem={({ item }) => (
                            <AppointmentCard appointments={item} />
                        )}
                    />
                </View>
            )}
        </Container>
    );
}
