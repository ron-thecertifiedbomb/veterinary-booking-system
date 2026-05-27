import {
    getSectionLabel,
    groupAppointmentsByDate,
    sortAppointmentsByDate,
} from "@/utils/appointments/appointments";
import { useEffect } from "react";
import { SectionList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Loader from "@/components/common/Loader/Loader";
import { useGetUserAppointments } from "@/features/users/hook/useGetUserAppointemts";
import { formatDate, getTodayDate } from "@/utils/dateandtime/date";
import { formatBookingCode } from "@/utils/formatter";
import { formatPHDate } from "@/utils/dateandtime/time";

export default function Schedule() {
    const {
        fetchAppointments,
        appointments,
        loading,
        error,
    } = useGetUserAppointments();

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) return <Loader fullScreen />;

    if (error) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text className="text-red-500">{error}</Text>
            </SafeAreaView>
        );
    }

    // ✅ Today info
    const date = getTodayDate();
    const now = new Date();
    const nowTime = now.getTime();

    // ✅ ✅ IMPORTANT: Filter ONLY upcoming (fixes duplication with History screen)
    const upcoming = appointments.filter(
        (item) => new Date(item.appointmentDate).getTime() >= nowTime
    );

    // ✅ Sort + Group
    const sorted = sortAppointmentsByDate(upcoming);
    const grouped = groupAppointmentsByDate(sorted);

    const sections = Object.keys(grouped)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map((dateKey) => ({
            title: getSectionLabel(dateKey),
            data: grouped[dateKey],
        }));

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">

                {/* ✅ HEADER */}
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        My Schedule
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        View your upcoming appointments and plan ahead.
                    </Text>
                </View>

                {/* ✅ DATE CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-4">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Today is
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>

                    <Text className="text-xs text-text-secondary mt-1">
                        {now.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>

                {/* ✅ Label */}
                <Text className="text-sm text-text-muted mb-2">
                    Upcoming Appointments
                </Text>

                {/* ✅ SECTION LIST */}
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.bookingCode}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40 }}

                    renderSectionHeader={({ section: { title } }) => (
                        <Text
                            className={`text-sm uppercase mt-2 mb-2 ${title === "Today"
                                ? "text-primary font-semibold"
                                : "text-text-muted"
                                }`}
                        >
                            {title}
                        </Text>
                    )}

                    renderItem={({ item }) => {



        
                        return (
                            <View className="bg-surface border border-border rounded-2xl p-4 mb-3">

                                {/* ✅ Top row */}

                                <View className="flex-row justify-between items-center">

                                    <Text className="text-base font-semibold text-text-primary">
                                        {item.petName}
                                    </Text>

                                    <View className="border-[0.2px] px-2 py-1 rounded-full">
                                        <Text className="text-[12px] font-bold">
                                            {item.status.toUpperCase()}
                                        </Text>
                                    </View>

                                </View>

                                {/* ✅ Service */}

                                <Text className="text-sm text-text-secondary mt-1">{formatPHDate(item.appointmentDate)}</Text>
                                <Text className="text-sm text-text-secondary mt-1">
                                    {item.serviceType}
                                </Text>
                                {/* ✅ Ref */}
                                <Text className="text-sm text-text-secondary mt-1">
                                    Ref: {formatBookingCode(item.bookingCode)}
                                </Text>
                            </View>
                        );
                    }}
                />
            </View>
        </View>
    );
}