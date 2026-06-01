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
        appointments = [],
        loading,
        error,
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

    // ✅ LOADING
    if (loading) return <Loader fullScreen />;

    // ✅ ERROR
    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-red-500 text-sm text-center">
                    {error}
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={appointments}
            keyExtractor={(item) => item.bookingCode}
            showsVerticalScrollIndicator={false}
            contentContainerClassName="pt-6 lg:pt-14 px-4 lg:px-0"

            // ✅ HEADER
            ListHeaderComponent={

                <HeaderSection
                    title="My Appointments"
                    description="Track and review your upcoming and past bookings."
                    date={date}
                    time={now.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                />

            }

   
            ListEmptyComponent={
                <View className="w-full flex justify-center items-center px-6 ">
                <View className="w-full max-w-3xl">
                    <EmptyState
                        icon=""
                        title="No appointments booked"
                        description="Add your first appointment."
                        buttonLabel="Book an Appointment"
                        onPress={handleAddAppointment}
                    />
                </View>
                </View>
            }

            // ✅ ITEMS
            renderItem={({ item }) => {
                const dateObj = new Date(item.appointmentDate);

                const statusConfig =
                    STATUS_CONFIG[item.status as AppointmentStatus] ?? {
                        bg: "bg-gray-100",
                        text: "text-gray-600",
                        dot: "bg-gray-400",
                        label: item.status,
                    };

                const serviceEmoji =
                    item.serviceType === "Grooming"
                        ? "✂️"
                        : item.serviceType === "Vaccination"
                            ? "💉"
                            : item.serviceType === "Checkup"
                                ? "🩺"
                                : item.serviceType === "Dental"
                                    ? "🦷"
                                    : "🐾";

                return (

                    <View className="w-full max-w-3xl m-auto">

                        {/* ✅ CARD */}
                        <View
                            className="bg-white rounded-2xl p-6 mb-5 border border-border"
                            style={{
                                boxShadow: "0px 10px 30px rgba(2,6,23,0.06)",
                            }}
                        >

                            {/* ✅ HEADER */}
                            <View className="flex-row items-center justify-between mb-5">

                                {/* LEFT: PET INFO */}
                                <View>
                                    <Text className="text-sm font-semibold text-text-primary">
                                        {item.pet.petName}
                                    </Text>
                                    <Text className="text-xs text-text-muted mt-0.5">
                                        {item.serviceType}
                                    </Text>
                                </View>

                                {/* RIGHT: STATUS */}
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

                            {/* ✅ DIVIDER */}
                            <View className="h-px bg-border mb-5" />

                            {/* ✅ DATE + TIME */}
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

                            {/* ✅ EXTRA INFO ROW */}
                            <View className="flex-row justify-between items-center py-3">

                                {/* BOOKING */}
                                <View>
                                    <Text className="text-xs text-text-muted">Reference</Text>
                                    <Text className="text-sm font-mono font-semibold text-text-primary tracking-wide">
                                        {formatBookingCode(item.bookingCode)}
                                    </Text>
                                </View>

                                {/* SERVICE */}
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
    );
}