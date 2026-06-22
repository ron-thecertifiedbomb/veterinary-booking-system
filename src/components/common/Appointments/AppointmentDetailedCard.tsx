import { Appointment, StaffDropdownItem } from "@/features/appointment/types/appointment";
import { 
  formatAppointmentDateOnly, 
  formatAppointmentTimeOnly, 
  formatBookingCode, 
  formatReadableDate 
} from "@/utils/appointments/formatter";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Share } from "react-native";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!appointment) return null;

  const isBooked = appointment.status === "BOOKED";
  const petInitial = appointment.pet?.petName ? appointment.pet.petName.charAt(0).toUpperCase() : "?";

  const handleShareBooking = async () => {
    try {
      await Share.share({
        message: `Appointment: ${formatBookingCode(appointment.bookingCode)}\nService: ${appointment.serviceType}\nDate: ${formatReadableDate(appointment.appointmentDate)}`,
      });
    } catch (error) {
      console.error("Error sharing booking details", error);
    }
  };

  // Helper for dynamic status pill styling
  const getStatusColor = (status: string) => {
    switch(status.toUpperCase()) {
      case 'BOOKED': return 'bg-black text-white';
      case 'CANCELLED': return 'bg-red-500 text-white';
      case 'COMPLETED': return 'bg-emerald-500 text-white';
      default: return 'bg-zinc-800 text-white';
    }
  };

  return (
    <View className="bg-white p-5 rounded-[32px] border border-zinc-200/80 shadow-sm mb-4">
      
      {/* ─── HEADER: SERVICE & STATUS ─── */}
      <View className="flex-row justify-between items-start mb-5">
        <View className="flex-1 mr-4">
          <Text className="text-[9px] font-black tracking-widest uppercase text-zinc-400 mb-1">
            Service Type
          </Text>
          <Text 
            className="text-3xl font-black tracking-tighter text-zinc-950 uppercase leading-none"
            numberOfLines={2}
          >
            {appointment.serviceType}
          </Text>
        </View>
        {/* <View className={`px-3 py-1.5 rounded-full shadow-sm mt-1 ${getStatusColor(appointment.status)}`}>
          <Text className="text-[9px] font-black tracking-widest uppercase text-current">
            {appointment.status}
          </Text>
        </View> */}
      </View>

      {/* ─── TICKET BLOCK: DATE & TIME ─── */}
      <View className="flex-row rounded-[20px] p-4  mb-5">
        <View className="flex-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-0.5">
            Date
          </Text>
          <Text className="text-sm font-black text-zinc-900 uppercase">
            {formatAppointmentDateOnly(appointment.appointmentDate)}
          </Text>
        </View>
        
        <View className="w-[1px] bg-zinc-200 mx-4" />
        
        <View className="flex-1 items-end">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-0.5">
            Time
          </Text>
          <Text className="text-sm font-black text-zinc-900 uppercase">
            {formatAppointmentTimeOnly(appointment.appointmentDate)}
          </Text>
        </View>
      </View>

      {/* ─── REFERENCE ID & SHARE ─── */}
      <View className="flex-row justify-between items-end mb-6 px-1">
        <View className="flex-1 mr-4">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1.5">
            Reference ID
          </Text>
          <View className="self-start px-2.5 py-1 rounded-md ">
            <Text className="text-xs font-mono font-bold tracking-widest text-zinc-700 select-all">
              {formatBookingCode(appointment.bookingCode)}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={handleShareBooking} 
          activeOpacity={0.8}
          className="bg-zinc-100 px-4 py-2 rounded-full "
        >
          <Text className="text-zinc-700 text-[10px] font-black tracking-widest uppercase">Share</Text>
        </TouchableOpacity>
      </View>

      {/* ─── PATIENT DOSSIER ─── */}
      <View className="mb-6">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-2 px-1">
          Patient Profile
        </Text>
        <View className="flex-row items-center  rounded-[24px] p-3">
          {/* Avatar */}
          {/* <View className="w-12 h-12 bg-zinc-950 rounded-[16px] items-center justify-center mr-3 shadow-sm">
            <Text className="text-white text-xl font-black tracking-tighter">
              {petInitial}
            </Text>
          </View> */}
          {/* Info */}
          <View className="flex-1">
            <Text className="text-lg font-black tracking-tight text-zinc-900 uppercase leading-none mb-1">
              {appointment.pet?.petName}
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                {appointment.pet?.species}
              </Text>
              {appointment.pet?.breed && (
                <>
                  <Text className="text-[9px] text-zinc-300">•</Text>
                  <Text className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                    {appointment.pet.breed}
                  </Text>
                </>
              )}
            </View>
          </View>
          {/* Weight */}
          <View className="items-end pl-3 border-l border-zinc-100 pr-2">
            <Text className="text-base font-black text-zinc-900 leading-none">
              {appointment.pet?.weight ? `${appointment.pet.weight / 100}` : "—"}
            </Text>
            <Text className="text-[8px] font-black tracking-[0.1em] text-zinc-400 uppercase mt-0.5">
              KG
            </Text>
          </View>
        </View>
      </View>

      {/* ─── CLINICAL ASSIGNMENT (Inline Accordion) ─── */}
      <View className="mb-6 px-1">
        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-2">
         Assigned Doctor:
        </Text>
        
        {appointment.staff ? (
          <Text className="text-base font-black text-zinc-900 uppercase tracking-tight">
          {appointment.staff.name}
          </Text>
        ) : loadingStaff ? (
          <Text className="text-xs font-bold italic text-zinc-400 uppercase tracking-wider">
            Checking schedules...
          </Text>
        ) : staffError ? (
          <Text className="text-xs font-bold text-red-500 uppercase tracking-wider">
            {staffError}
          </Text>
        ) : staffOptions.length > 0 ? (
          <View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex-row items-center justify-between bg-zinc-50 border border-zinc-200 px-4 py-3.5 rounded-xl"
            >
              <Text className={`text-xs font-black tracking-widest uppercase ${selectedStaffId ? 'text-zinc-900' : 'text-zinc-400'}`}>
                {selectedStaffId 
                  ? staffOptions.find(d => d.value === selectedStaffId)?.label
                  : "Assign a Doctor..."}
              </Text>
              <Text className="text-[10px] font-black text-zinc-400">
                {isDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {/* Inline Expanding List (Prevents mobile clipping) */}
            {isDropdownOpen && (
              <View className="mt-2 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                {staffOptions.map((doctor, index) => {
                  const isSelected = doctor.value === selectedStaffId;
                  const isLast = index === staffOptions.length - 1;
                  
                  return (
                    <TouchableOpacity
                      key={doctor.value}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (onAssignStaff) onAssignStaff(doctor.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-4 py-3.5 flex-row justify-between items-center bg-white ${!isLast ? 'border-b border-zinc-100' : ''}`}
                    >
                      <Text className={`text-xs font-black tracking-widest uppercase ${isSelected ? 'text-indigo-600' : 'text-zinc-700'}`}>
                        {doctor.label}
                      </Text>
                      {isSelected && <Text className="text-xs font-black text-indigo-600">✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ) : (
          <Text className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            No doctors available
          </Text>
        )}
      </View>

      {/* ─── REMARKS ─── */}
      {appointment.notes && (
        <View className="mb-6 px-1">
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-2">
            Remarks:
          </Text>
          <View>
            <Text className="text-xs font-medium leading-relaxed text-black">
              {appointment.notes}
            </Text>
          </View>
        </View>
      )}

      {/* ─── DESTRUCTIVE ACTION ─── */}
      {isBooked && onCancelPress && (
        <View className="pt-2 border-t border-zinc-100">
          <TouchableOpacity 
            onPress={onCancelPress}
            activeOpacity={0.8}
            className="w-full bg-zinc-50 border border-zinc-200 py-4 rounded-[16px] items-center"
          >
            <Text className="text-red-500 text-[10px] font-black tracking-widest uppercase">
              Cancel Appointment
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};