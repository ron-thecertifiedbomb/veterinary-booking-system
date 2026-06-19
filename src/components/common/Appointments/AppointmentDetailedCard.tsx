import { Appointment, StaffDropdownItem } from "@/features/appointment/types/appointment";

import { 
  formatAppointmentDateOnly, 
  formatAppointmentTimeOnly, 
  formatBookingCode, 
  formatReadableDate 
} from "@/utils/appointments/formatter";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Share } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface AppointmentDetailCardProps {
  appointment: Appointment | null;
  onCancelPress?: () => void;
  staffOptions?: StaffDropdownItem[];
  loadingStaff?: boolean;
  staffError?: string | null;
  selectedStaffId?: string;
  onAssignStaff?: (staffId: string) => void;
}

export const AppointmentDetailCard: React.FC<AppointmentDetailCardProps> = ({
  appointment,
  onCancelPress,
  staffOptions = [],
  loadingStaff = false,
  staffError = null,
  selectedStaffId,
  onAssignStaff,
}) => {
  if (!appointment) return null;

  const isBooked = appointment.status === "BOOKED";
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
      
      {/* Service Type Header */}
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

      {/* Date & Time */}
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

      {/* Reference ID & Share */}
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

      {/* Patient Profile */}
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

      {/* Clinical Assignment Section */}
        <View className="pt-1 relative z-30 bg-white">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
          Clinical Assignment
        </Text>
        {appointment.staff ? (
          <Text className="text-sm font-bold text-zinc-800 uppercase">
            {appointment.staff.name}
          </Text>
        ) : loadingStaff ? (
          <Text className="text-xs italic text-zinc-400 uppercase">
            Checking available schedules...
          </Text>
        ) : staffError ? (
          <Text className="text-xs font-bold text-red-500 uppercase">
            {staffError}
          </Text>
        ) : staffOptions.length > 0 ? (
          <View className="relative w-full z-40 bg-white">
            
            {/* Main Trigger Box */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-[50px] flex-row items-center justify-between bg-white px-1 -ml-1"
              style={{ outlineStyle: 'none' } as any}
            >
              <Text className={`text-[13px] font-black tracking-wide uppercase ${selectedStaffId ? 'text-black' : 'text-zinc-400'}`}>
                {selectedStaffId 
                  ? staffOptions.find(d => d.value === selectedStaffId)?.label.toUpperCase() 
                  : "CHOOSE AN AVAILABLE DOCTOR..."}
              </Text>
              <Text className="text-[10px] font-bold text-black ml-2">▼</Text>
            </TouchableOpacity>

            {/* Float Option List Popover — Explicitly cast on top layer shadow */}
            {isDropdownOpen && (
              <View className="absolute top-[45px] left-0 w-full bg-white rounded-2xl shadow-xl py-2 mt-1 z-50 border-0">
                {staffOptions.map((doctor) => {
                  const isSelected = doctor.value === selectedStaffId;
                  return (
                    <TouchableOpacity
                      key={doctor.value}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (onAssignStaff) onAssignStaff(doctor.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-3 flex-row justify-between items-center bg-white ${
                        isSelected ? 'bg-zinc-100' : 'hover:bg-zinc-50'
                      }`}
                    >
                      <Text className={`text-[13px] font-black tracking-wide uppercase ${isSelected ? 'text-black' : 'text-zinc-800'}`}>
                        {doctor.label.toUpperCase()}
                      </Text>
                      {isSelected && <Text className="text-xs font-black text-black">✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ) : (
          <Text className="text-sm font-bold text-zinc-400 uppercase">
            No doctors available for this slot
          </Text>
        )}
      </View>

      {/* Cancel Button Block — Explicitly set below the selector stack */}
      {isBooked && onCancelPress && (
        <TouchableOpacity 
          onPress={onCancelPress}
          activeOpacity={0.9}
          className="w-full bg-black py-4 rounded-full items-center mt-2 relative z-10"
        >
          <Text className="text-white text-xs font-black tracking-[0.2em] uppercase">
            Cancel Appointment
          </Text>
        </TouchableOpacity>
      )}


      {/* Remarks */}
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

      {/* Cancel Button */}
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
