import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { formatDate, getTodayDate } from "@/utils/dateandtime/date";
import { formatBookingCode } from "@/utils/formatter";

import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { FlatList, Platform, Text, View } from "react-native";

// ✅ STATUS TYPE
type AppointmentStatus = "booked" | "cancelled" | "completed";

// ✅ STATUS CONFIG
const STATUS_CONFIG: Record<
    AppointmentStatus,
    {
        bg: string;
        text: string;
        dot: string;
        label: string;
    }
> = {
    booked: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
        label: "Booked",
    },
    cancelled: {
        bg: "bg-red-50",
        text: "text-red-600",
        dot: "bg-red-500",
        label: "Cancelled",
    },
    completed: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        dot: "bg-blue-500",
        label: "Completed",
    },
};

export default function Appointments() {
    const date = getTodayDate();
    const now = new Date();

    const {
        fetchAppointments,
        appointments,
        loading,
    } = useGetUserAppointments();

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [])
    );

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";

        router.push(
            isWeb
                ? "/(web)/web-home"
                : "/(app)/(tabs)/home"
        );
    };
    const isEmpty = appointments.length === 0;
    // ✅ LOADING
    if (loading) return <Loader fullScreen />;
    return (

        <Container>
            <HeaderSection
                title="My Appointments"
                description="Track and review your upcoming and past bookings."
        
            />
            {isEmpty && (
                <EmptyState
                    title="No booked appointments"
                    description="Add your first appointment."
                    buttonLabel="Book an Appointment"
                    onPress={handleAddAppointment}
                />
            )}
            {!isEmpty && (
            <FlatList
                className="w-full"
                data={appointments}
                keyExtractor={(item) => item.bookingCode}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const dateObj = new Date(item.appointmentDate);
                    const statusConfig =
                        STATUS_CONFIG[item.status as AppointmentStatus] ?? {
                            bg: "bg-gray-100",
                            text: "text-gray-600",
                            dot: "bg-gray-400",
                            label: item.status,
                        };

                    return (
                        <View className="w-full">
                            <View
                                className="bg-white rounded-2xl p-6 mb-5 border border-border"
                                style={{
                                    boxShadow: "0px 10px 30px rgba(2,6,23,0.06)",
                                }}
                            >
                                <View className="flex-row items-center justify-between mb-5">
                                    <View>
                                        <Text className="text-sm font-semibold text-text-primary">
                                            {item.pet.petName}
                                        </Text>
                                        <Text className="text-xs text-text-muted mt-0.5">
                                            {item.serviceType}
                                        </Text>
                                    </View>

                                    <View
                                        className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${statusConfig.bg}`}
                                    >
                                        <View
                                            className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`}
                                        />
                                        <Text className={`text-xs font-medium ${statusConfig.text}`}>
                                            {statusConfig.label}
                                        </Text>
                                    </View>
                                </View>
                                <View className="h-px bg-border mb-5" />
                                <View className="flex-row justify-between mb-5">
                                    <View>
                                        <Text className="text-xs text-text-muted mb-1">Date</Text>
                                        <Text className="text-sm font-medium text-text-primary">
                                            {dateObj.toLocaleDateString([], {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-text-muted mb-1">Time</Text>
                                        <Text className="text-sm font-medium text-text-primary">
                                            {dateObj.toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Text>
                                    </View>

                                </View>
                                <View className="flex-row justify-between items-center py-3">
                                    <View>
                                        <Text className="text-xs text-text-muted">Reference</Text>
                                        <Text className="text-sm font-mono font-semibold text-text-primary tracking-wide">
                                            {formatBookingCode(item.bookingCode)}
                                        </Text>
                                    </View>
                                    <View>
                                        <Text className="text-xs text-right">
                                            Service
                                        </Text>
                                        <Text className="text-sm font-semibold text-text-primary text-right">
                                            {item.serviceType}
                                        </Text>
                                    </View>

                                </View>

                            </View>
                        </View>
                    );
                }}
                />
            )}
        </Container>
    );
}