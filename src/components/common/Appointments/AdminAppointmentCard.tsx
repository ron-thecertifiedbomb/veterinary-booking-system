import StatusBadge from "@/components/ui/StatusBadge";
import { Appointment } from "@/features/admin/types/admin.types";
import { colors, iconSize } from "@/theme/tokens";
import {
  formatAppointmentTimeOnly,
  formatBookingCode,
} from "@/utils/appointments/formatter";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Text, View } from "react-native";

type Props = {
  appointment: Appointment;
};

function statusVariant(status: string) {
  switch (status) {
    case "BOOKED":
    case "CONFIRMED":
      return "success" as const;
    case "COMPLETED":
      return "default" as const;
    case "CANCELLED":
      return "danger" as const;
    default:
      return "muted" as const;
  }
}

function formatServiceLabel(service: string) {
  return service
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function dateParts(dateString: string) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { month: "—", day: "—", weekday: "" };
  }

  return {
    month: date.toLocaleDateString("en-US", { month: "short" }),
    day: date.toLocaleDateString("en-US", { day: "numeric" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

function customerName(appointment: Appointment) {
  if (appointment.customer && "name" in appointment.customer && appointment.customer.name) {
    return appointment.customer.name;
  }
  if (appointment.customer && "user" in appointment.customer) {
    return (appointment.customer as { user?: { name?: string } }).user?.name || "Unknown customer";
  }
  return "Unknown customer";
}

export default function AdminAppointmentCard({ appointment }: Props) {
  const parts = useMemo(() => dateParts(appointment.appointmentDate), [appointment.appointmentDate]);
  const owner = customerName(appointment);
  const staffName = appointment.staff?.name || "Unassigned";

  return (
    <View className="bg-surface border border-border rounded-xl mb-3 overflow-hidden">
      <View className="flex-row items-stretch">
        <View className="w-[72px] items-center justify-center bg-surfaceMuted border-r border-border py-4 px-2">
          <Text className="text-xs font-medium text-text-muted capitalize font-sans">{parts.month}</Text>
          <Text className="text-2xl font-bold text-text-primary leading-7 font-sans">{parts.day}</Text>
          {parts.weekday ? (
            <Text className="text-xs text-text-muted mt-0.5 font-sans">{parts.weekday}</Text>
          ) : null}
        </View>

        <View className="flex-1 p-4 pr-3 min-w-0">
          <View className="flex-row items-start justify-between gap-3 mb-2">
            <View className="flex-1 min-w-0">
              <Text className="text-body font-semibold text-text-primary font-sans" numberOfLines={1}>
                {appointment.pet?.petName || "Unknown pet"}
              </Text>
              <Text className="text-sm text-text-secondary mt-0.5 font-sans" numberOfLines={1}>
                {owner} · {formatServiceLabel(appointment.serviceType)}
              </Text>
            </View>
            <StatusBadge label={appointment.status} variant={statusVariant(appointment.status)} />
          </View>

          <View className="flex-row flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="time-outline" size={iconSize.sm} color={colors.text.muted} />
              <Text className="text-xs text-text-secondary font-sans">
                {formatAppointmentTimeOnly(appointment.appointmentDate)}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Ionicons name="document-text-outline" size={iconSize.sm} color={colors.text.muted} />
              <Text className="text-xs text-text-muted font-sans">
                {formatBookingCode(appointment.bookingCode)}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5 mt-2.5">
            <Ionicons name="medical-outline" size={iconSize.sm} color={colors.text.muted} />
            <Text className="text-xs text-text-muted font-sans" numberOfLines={1}>
              {staffName}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
