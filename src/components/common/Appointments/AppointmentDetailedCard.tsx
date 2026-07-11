import AppButton from "@/components/ui/AppButton";
import SectionLabel from "@/components/ui/SectionLabel";
import StatusBadge from "@/components/ui/StatusBadge";
import { Appointment } from "@/features/appointment/types/appointment";
import {
  formatAppointmentDateOnly,
  formatAppointmentTimeOnly,
  formatBookingCode,
} from "@/utils/appointments/formatter";
import React from "react";
import { View, Text, Share } from "react-native";

interface AppointmentDetailCardProps {
  appointment: Appointment | null;
  onCancelPress?: () => void;
}

function statusVariant(status: string) {
  switch (status) {
    case "BOOKED":
      return "success" as const;
    case "COMPLETED":
      return "default" as const;
    case "CANCELLED":
      return "danger" as const;
    default:
      return "muted" as const;
  }
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
        message: `Ref: ${formatBookingCode(appointment.bookingCode)}\n${appointment.serviceType}\n${formatAppointmentDateOnly(appointment.appointmentDate)}`,
      });
    } catch {
      /* ignore */
    }
  };

  return (
    <View>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-3">
          <SectionLabel>Service</SectionLabel>
          <Text className="text-h2 text-text-primary mt-1">{appointment.serviceType}</Text>
        </View>
        <StatusBadge label={appointment.status} variant={statusVariant(appointment.status)} />
      </View>

      <View className="flex-row gap-4 py-3 border-y border-border mb-4">
        <View className="flex-1">
          <SectionLabel>Date</SectionLabel>
          <Text className="text-body text-text-primary mt-1">
            {formatAppointmentDateOnly(appointment.appointmentDate)}
          </Text>
        </View>
        <View className="flex-1">
          <SectionLabel>Time</SectionLabel>
          <Text className="text-body text-text-primary mt-1">
            {formatAppointmentTimeOnly(appointment.appointmentDate)}
          </Text>
        </View>
      </View>

      <View className="bg-surfaceMuted border border-border rounded-lg p-3 flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <SectionLabel>Reference</SectionLabel>
          <Text className="text-sm font-medium text-text-primary mt-1">
            {formatBookingCode(appointment.bookingCode)}
          </Text>
        </View>
        <AppButton label="Share" onPress={handleShareBooking} fullWidth={false} variant="secondary" />
      </View>

      <View className="mb-4">
        <SectionLabel>Patient</SectionLabel>
        <Text className="text-body font-medium text-text-primary mt-1">
          {appointment.pet?.petName}
        </Text>
        <Text className="text-sm text-text-secondary mt-0.5">
          {[appointment.pet?.species, appointment.pet?.breed].filter(Boolean).join(" · ")}
          {appointment.pet?.weight ? ` · ${appointment.pet.weight / 100} kg` : ""}
        </Text>
      </View>

      <View className="mb-4">
        <SectionLabel>Assigned staff</SectionLabel>
        <Text className="text-body text-text-primary mt-1">
          {appointment.staff?.name || "Awaiting assignment"}
        </Text>
      </View>

      {appointment.notes ? (
        <View className="mb-4">
          <SectionLabel>Notes</SectionLabel>
          <Text className="text-sm text-text-secondary mt-1 leading-5">{appointment.notes}</Text>
        </View>
      ) : null}

      {isBooked && onCancelPress ? (
        <AppButton label="Cancel appointment" onPress={onCancelPress} variant="secondary" />
      ) : null}
    </View>
  );
};
