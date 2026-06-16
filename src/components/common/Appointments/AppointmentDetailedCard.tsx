import { Appointment } from "@/features/appointment/types/appointment";
import { 
  formatAppointmentDateOnly, 
  formatAppointmentTimeOnly, 
  formatBookingCode, 
  formatReadableDate 
} from "@/utils/appointments/formatter";
import React from "react";
import { View, Text, TouchableOpacity, Share } from "react-native";

interface AppointmentDetailCardProps {
  appointment: Appointment | null;
  onCancelPress?: () => void;
}

export const AppointmentDetailCard: React.FC<AppointmentDetailCardProps> = ({
  appointment,
  onCancelPress,
}) => {
  if (!appointment) return null;

  const isBooked = appointment.status === "BOOKED";

  const handleShareBooking = async () => {
    try {
      await Share.share({
        message: `Appointment: ${formatBookingCode(appointment.bookingCode)}\nService: ${appointment.serviceType}\nDate: ${formatReadableDate(appointment.appointmentDate)}`,
      });
    } catch (error) {
      console.error("Error sharing booking details", error);
    }
  };

  return (
    // 1. Softer, deeper premium roundness for the outer container frame
    <View className="bg-white dark:bg-black p-6 rounded-3xl space-y-6 border border-zinc-200 dark:border-zinc-800">
      
      {/* ─── HEADER ROW ─── */}
      <View className="flex-row justify-between items-center pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <View>
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Service Type
          </Text>
          <Text className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase">
            {appointment.serviceType}
          </Text>
        </View>
        
        {/* 2. Swapped to completely pill-shaped status badge */}
        <View className="bg-transparent px-3 py-1 border border-black dark:border-white rounded-full">
          <Text className="text-[9px] font-black tracking-widest uppercase text-black dark:text-white">
            {appointment.status}
          </Text>
        </View>
      </View>

      {/* ─── SCHEDULE BLOCK ─── */}
      <View className="flex-row justify-between items-center py-1">
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Date
          </Text>
          <Text className="text-sm font-bold text-black dark:text-white uppercase">
            {formatAppointmentDateOnly(appointment.appointmentDate)}
          </Text>
        </View>
        <View className="w-[1px] h-8 bg-zinc-200 dark:bg-zinc-800 mx-6" />
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Time
          </Text>
          <Text className="text-sm font-bold text-black dark:text-white uppercase">
            {formatAppointmentTimeOnly(appointment.appointmentDate)}
          </Text>
        </View>
      </View>

      {/* ─── REF CODE CARD ─── */}
      {/* 3. Upgraded sub-container boxes to match the softer 24px curve */}
      <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Reference ID
          </Text>
          <Text className="text-xs font-mono font-bold tracking-tight text-zinc-800 dark:text-zinc-200 select-all" numberOfLines={1}>
            {formatBookingCode(appointment.bookingCode)}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleShareBooking} 
          activeOpacity={0.8}
          className="bg-black dark:bg-white px-4 py-2 rounded-full" // 4. Pill action trigger button
        >
          <Text className="text-white dark:text-black text-[10px] font-black tracking-widest uppercase">Share</Text>
        </TouchableOpacity>
      </View>

      {/* ─── PATIENT PROFILE ─── */}
      <View className="pt-1">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-3">
          Patient Profile
        </Text>
        <View className="border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 flex-row justify-between items-center">
          <View>
            <Text className="text-base font-black tracking-tight text-black dark:text-white uppercase">
              {appointment.pet?.petName}
            </Text>
            <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 font-medium">
              {appointment.pet?.species} / {appointment.pet?.breed}
            </Text>
          </View>
          <View className="border-l border-zinc-200 dark:border-zinc-800 pl-4 py-1">
            <Text className="text-xs font-black text-black dark:text-white">
              {appointment.pet?.weight ? `${appointment.pet.weight / 100} KG` : "—"}
            </Text>
          </View>
        </View>
      </View>

      {/* ─── CLINICAL ASSIGNMENT ─── */}
      <View className="pt-1">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
          Clinical Assignment
        </Text>
        <Text className="text-sm font-bold text-zinc-800 dark:text-zinc-200 uppercase">
          {appointment.staff ? appointment.staff.name : "Awaiting Assignment"}
        </Text>
      </View>

      {/* ─── OWNER REMARKS ─── */}
      {appointment.notes && (
        <View className="pt-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1.5">
            Remarks
          </Text>
          <Text className="text-xs font-medium leading-relaxed text-zinc-600 dark:text-zinc-400 border-l-2 border-zinc-200 dark:border-white pl-3">
            {appointment.notes}
          </Text>
        </View>
      )}

      {/* ─── ACTION TRIGGER ─── */}
      {isBooked && onCancelPress && (
        <TouchableOpacity 
          onPress={onCancelPress}
          activeOpacity={0.9}
          className="w-full bg-black dark:bg-white py-4 rounded-full items-center mt-2" // 5. Unified pill primary button
        >
          <Text className="text-white dark:text-black text-xs font-black tracking-[0.2em] uppercase">
            Cancel Appointment
          </Text>
        </TouchableOpacity>
      )}
      
    </View>
  );
};
