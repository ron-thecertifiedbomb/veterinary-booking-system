import StatusBadge from "@/components/ui/StatusBadge";
import { Appointment } from "@/features/appointment/types/appointment";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { colors, iconSize } from "@/theme/tokens";
import {
  formatAppointmentTimeOnly,
  formatBookingCode,
} from "@/utils/appointments/formatter";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Platform, Pressable, Text, View } from "react-native";

type AppointmentCardProps = {
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

export default function AppointmentCard({ appointment }: AppointmentCardProps) {
  const parts = useMemo(() => dateParts(appointment.appointmentDate), [appointment.appointmentDate]);
  const { isCompact, isNarrow } = useIsCompactScreen();
  const isWeb = Platform.OS === "web";

  const openDetail = () => {
    if (isWeb) {
      router.push(`/(web)/appointments/${appointment.id}`);
      return;
    }
    router.push(`/(app)/appointments/${appointment.id}`);
  };

  const petLine = [appointment.pet?.species, appointment.pet?.breed].filter(Boolean).join(" · ");

  return (
    <Pressable
      onPress={openDetail}
      className="bg-surface border border-border rounded-xl mb-3 overflow-hidden"
      style={({ pressed }) => ({
        opacity: pressed ? 0.94 : 1,
        borderColor: pressed ? colors.borderStrong : colors.border,
      })}
    >
      <View className="flex-row items-stretch">
        <View
          className={`${
            isNarrow ? "w-14" : isCompact ? "w-16" : "w-[72px]"
          } items-center justify-center bg-surfaceMuted border-r border-border py-4 px-1.5 shrink-0`}
        >
          <Text className="text-xs font-medium text-text-muted capitalize font-sans">{parts.month}</Text>
          <Text
            className={`${
              isNarrow ? "text-xl" : "text-2xl"
            } font-bold text-text-primary leading-7 font-sans`}
          >
            {parts.day}
          </Text>
          {parts.weekday ? (
            <Text className="text-[10px] text-text-muted mt-0.5 font-sans">{parts.weekday}</Text>
          ) : null}
        </View>

        <View className="flex-1 p-3.5 sm:p-4 min-w-0">
          <View
            className={
              isCompact
                ? "gap-2 mb-2"
                : "flex-row items-start justify-between gap-3 mb-2"
            }
          >
            <View className="flex-1 min-w-0">
              <Text className="text-body font-semibold text-text-primary font-sans" numberOfLines={2}>
                {appointment.pet?.petName || "Unknown pet"}
              </Text>
              <Text className="text-sm text-text-secondary mt-0.5 font-sans" numberOfLines={2}>
                {formatServiceLabel(appointment.serviceType)}
              </Text>
            </View>
            {!isCompact ? (
              <StatusBadge label={appointment.status} variant={statusVariant(appointment.status)} />
            ) : null}
          </View>

          {isCompact ? (
            <View className="self-start mb-2">
              <StatusBadge label={appointment.status} variant={statusVariant(appointment.status)} />
            </View>
          ) : null}

          <View className="flex-row flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
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

          {petLine ? (
            <Text className="text-xs text-text-muted mt-2.5 font-sans" numberOfLines={1}>
              {petLine}
            </Text>
          ) : null}
        </View>

        {!isNarrow ? (
          <View className="justify-center pr-2 shrink-0">
            <Ionicons name="chevron-forward" size={iconSize.md} color={colors.text.muted} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}
