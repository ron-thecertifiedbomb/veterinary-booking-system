import { Appointment } from "@/features/appointment/types/appointment";
import { formatAppointmentSchedule, formatBookingCode } from "@/utils/appointments/formatter";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type AppointmentCardProps = {
    appointments: Appointment;
};

export default function AppointmentCard({ appointments }: AppointmentCardProps) {
    return (
        <Pressable
            onPress={() => router.push(`/appointments/${appointments.id}`)}
            style={({ pressed }) => ({
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.99 : 1 }],
            })}
            // Stark high-contrast borders, shadow-none for flat print aesthetics
            className="bg-white dark:bg-black p-6 lg:p-8 rounded-3xl mb-4 border border-zinc-200 dark:border-white shadow-none relative"
        >
            {/* ─── TOP ROW ─── */}
            <View className="flex-row justify-between items-start mb-2 lg:mb-4">
                <View>
                <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                    Appointment Schedule
                </Text>
                <Text className="text-sm font-black text-black dark:text-white uppercase">
                    {formatAppointmentSchedule(appointments.appointmentDate)} 
                </Text>
                    
                </View>            
            </View>
            <View className="mb-2 lg:mb-4">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-0.5">
                        Pet Name
                    </Text>
                    <Text className="text-base font-black tracking-tight text-black dark:text-white uppercase">
                        {appointments.pet?.petName || "Unknown Patient"}
                    </Text>
            </View>
        
     <View className="mb-2 lg:mb-4">
                <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-1">
                    Status
                </Text>
                <Text className="text-sm font-black text-black dark:text-white uppercase">
                    {appointments.status    } 
                </Text>
            </View>



            {/* ─── BOTTOM METADATA ROW ─── */}
            {/* <View className="flex-row justify-between items-end pt-3 border-t border-zinc-200 dark:border-white">
                <View>
                    <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-0.5">
                        Booked on
                    </Text>
                    <Text className="text-xs font-black text-black dark:text-white uppercase">
                        {formatAppointmentSchedule(appointments.createdAt)}   
                    </Text>
                </View>

                <View className="items-end">
                    <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-400 mb-0.5">
                        Ref Code
                    </Text>
                    <Text className="text-xs font-mono font-black tracking-wide text-black dark:text-white">
                        {formatBookingCode(appointments.bookingCode)}
                    </Text>
                </View>
            </View> */}

            {/* ─── STARK HINT ARROW ─── */}
            <View className="absolute right-5 top-6">
                <Text className="text-black dark:text-white text-xl font-black">›</Text>
            </View>
        </Pressable>
    );
}
