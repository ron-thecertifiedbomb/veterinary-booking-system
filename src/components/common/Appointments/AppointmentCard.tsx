
import { Appointment } from "@/features/appointment/types/appointment";
import { formatAppointmentSchedule } from "@/utils/appointments/formatter";
import { Href, router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type AppointmentCardProps = {
    appointments: Appointment;
    routerPath: Href<string>; // Allows dynamic paths while keeping Expo Router type safety
};

export default function AppointmentCard({ appointments, routerPath }: AppointmentCardProps) {

    const hasStatus = appointments.status === "BOOKED" || appointments.status === "COMPLETED";

    return (
        <Pressable
            onPress={() => router.push(routerPath)}
            style={({ pressed }) => ({
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
            className="bg-white p-5 rounded-3xl mb-4 border border-zinc-100 relative"
        >
            <View className="flex-row justify-between items-start mb-4 pr-6">
                <View>
                    <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
                   Schedule
                    </Text>
                    <Text className="text-sm font-black text-black uppercase">
                        {formatAppointmentSchedule(appointments.appointmentDate)} 
                    </Text>
                </View>
            </View>

            {/* ─── PATIENT BODY INFORMATION ─── */}
            <View className="mb-4">
                <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-0.5">
                    Pet Name
                </Text>
                <Text className="text-base font-black tracking-tight text-black uppercase">
                    {appointments.pet?.petName || "Unknown Patient"}
                </Text>
                {appointments.pet?.species && (
                    <Text className="text-xs text-zinc-500 font-medium mt-0.5">
                        {appointments.pet.species} {appointments.pet.breed ? `/ ${appointments.pet.breed}` : ''}
                    </Text>
                )}
            </View>
            <View className="absolute right-5 top-[26px]">
                <Text className="text-zinc-300 text-xl font-black">›</Text>
            </View>
        </Pressable>
    );
}
