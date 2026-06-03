import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { formatDateTime } from "@/utils/dateandtime/dateandtimeformatter";
import { formatBookingCode } from "@/utils/dateandtime/formatter";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, Platform, Text, View } from "react-native";

export default function Appointments() {
    const { fetchAppointments, appointments, loading } = useGetUserAppointments();

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/web-home" : "/(app)/(tabs)/home");
    };

    const isEmpty = appointments.length === 0;

    if (loading) return <Loader fullScreen />;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "bg-emerald-100 text-emerald-700";
            case "PENDING":
                return "bg-amber-100 text-amber-700";
            case "CANCELLED":
                return "bg-rose-100 text-rose-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <Container>
            <HeaderSection
                title="My Appointments"
                description="Track your upcoming and past bookings."
            />

            {isEmpty && (
                <EmptyState
                    title="No appointments yet"
                    description="Start by booking your first visit."
                    buttonLabel="Book an Appointment"
                    onPress={handleAddAppointment}
                />
            )}

            {!isEmpty && (
                <FlatList

                    data={appointments}
                    keyExtractor={(item) => item.bookingCode}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: 24,
                        paddingTop: 8,
                    }}
                    ListFooterComponent={<View style={{ height: 40 }} />}
                    keyboardShouldPersistTaps="handled"

                    renderItem={({ item }) => {
                        return (
                            <View
                                className="bg-white rounded-2xl p-5 mb-4 border border-border"
                                style={{
                                    boxShadow: "0px 12px 24px rgba(2,6,23,0.05)",
                                }}
                            >
                                {/* TOP ROW */}
                                <View className="flex-row justify-between items-start mb-4">
                                    <View>
                                        <Text className="text-xs text-text-muted mb-1">
                                            Appointment
                                        </Text>
                                        <Text className="text-base font-semibold text-text-primary">
                                            {formatDateTime(item.appointmentDate)}
                                        </Text>
                                    </View>

                                    <View
                                        className={`px-3 py-1 rounded-full ${getStatusStyle(
                                            item.status
                                        )}`}
                                    >
                                        <Text className="text-xs font-semibold">
                                            {item.status}
                                        </Text>
                                    </View>
                                </View>

                                {/* DIVIDER */}
                                <View className="h-px bg-border mb-4" />

                                {/* INFO ROW */}
                                <View className="flex-row justify-between mb-3">
                                    <View>
                                        <Text className="text-xs text-text-muted">Pet</Text>
                                        <Text className="text-sm font-medium text-text-primary">
                                            {item.pet.petName}
                                        </Text>
                                    </View>

                                    <View className="items-end">
                                        <Text className="text-xs text-text-muted">
                                            Service
                                        </Text>
                                        <Text className="text-sm font-semibold text-text-primary">
                                            {item.serviceType}
                                        </Text>
                                    </View>
                                </View>

                                {/* BOOKING CODE */}
                                <View className="pt-3 border-t border-dashed border-border">
                                    <Text className="text-xs text-text-muted mb-1">
                                        Reference Code
                                    </Text>
                                    <Text className="text-sm font-mono font-semibold tracking-wider text-text-primary">
                                        {formatBookingCode(item.bookingCode)}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />
            )}
        </Container>
    );
}