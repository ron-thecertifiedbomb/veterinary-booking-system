
import { Appointment } from "@/features/admin/types/admin.types";
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
    <View className="bg-white p-6 rounded-3xl space-y-6 border border-zinc-200">
      
      <View className="flex-row justify-between items-center pb-4 border-b border-zinc-200">
        <View>
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
            Service Type
          </Text>
          <Text className="text-2xl font-black tracking-tighter text-black uppercase">
            {appointment.serviceType}
          </Text>
        </View>
        <View className="bg-transparent px-3 py-1 border border-black rounded-full">
          <Text className="text-[9px] font-black tracking-widest uppercase text-black">
            {appointment.status}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center py-1">
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
            Date
          </Text>
          <Text className="text-sm font-bold text-black uppercase">
            {formatAppointmentDateOnly(appointment.appointmentDate)}
          </Text>
        </View>
        <View className="w-[1px] h-8 bg-zinc-200 mx-6" />
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
            Time
          </Text>
          <Text className="text-sm font-bold text-black uppercase">
            {formatAppointmentTimeOnly(appointment.appointmentDate)}
          </Text>
        </View>
      </View>
      <View className="bg-zinc-100 rounded-2xl p-4 flex-row justify-between items-center">
        <View className="flex-1 mr-4">
          <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
            Reference ID
          </Text>
          <Text className="text-xs font-mono font-bold tracking-tight text-zinc-800 select-all" numberOfLines={1}>
            {formatBookingCode(appointment.bookingCode)}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={handleShareBooking} 
          activeOpacity={0.8}
          className="bg-black px-4 py-2 rounded-full"
        >
          <Text className="text-white text-[10px] font-black tracking-widest uppercase">Share</Text>
        </TouchableOpacity>
      </View>
      <View className="pt-1">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">
          Patient Profile
        </Text>
        <View className="border border-zinc-200 rounded-2xl p-4 flex-row justify-between items-center">
          <View>
            <Text className="text-base font-black tracking-tight text-black uppercase">
              {appointment.pet?.petName}
            </Text>
            <Text className="text-xs text-zinc-500 mt-0.5 font-medium">
              {appointment.pet?.species} / {appointment.pet?.breed}
            </Text>
          </View>
          <View className="border-l border-zinc-200 pl-4 py-1">
            <Text className="text-xs font-black text-black">
              {appointment.pet?.weight ? `${appointment.pet.weight / 100} KG` : "—"}
            </Text>
          </View>
        </View>
      </View>
      <View className="pt-1">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
          Clinical Assignment
        </Text>
        <Text className="text-sm font-bold text-zinc-800 uppercase">
          {appointment.staff ? appointment.staff.name : "Awaiting Assignment"}
        </Text>
      </View>
      {appointment.notes && (
        <View className="pt-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1.5">
            Remarks
          </Text>
          <Text className="text-xs font-medium leading-relaxed text-zinc-600 border-l-2 border-zinc-200 pl-3">
            {appointment.notes}
          </Text>
        </View>
      )}
      {isBooked && onCancelPress && (
        <TouchableOpacity 
          onPress={onCancelPress}
          activeOpacity={0.9}
          className="w-full bg-black py-4 rounded-full items-center mt-2"
        >
          <Text className="text-white text-xs font-black tracking-[0.2em] uppercase">
            Cancel Appointment
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
