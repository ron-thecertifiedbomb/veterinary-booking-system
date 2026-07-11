import AppButton from "@/components/ui/AppButton";
import SectionLabel from "@/components/ui/SectionLabel";
import StatusBadge from "@/components/ui/StatusBadge";
import { CreateAppointmentResponse } from "@/features/appointment/types/appointment";
import { Modal, View, Text } from "react-native";

type Props = {
  visible: boolean;
  items?: CreateAppointmentResponse | null;
  onClose: () => void;
};

function statusVariant(status: string) {
  switch (status?.toUpperCase()) {
    case "BOOKED":
    case "APPROVED":
      return "success" as const;
    case "PENDING":
      return "warning" as const;
    case "CANCELLED":
      return "danger" as const;
    default:
      return "default" as const;
  }
}

function DetailRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <View className="mb-3">
      <SectionLabel>{label}</SectionLabel>
      <Text className="text-body text-text-primary mt-1">{value}</Text>
    </View>
  );
}

export default function BookingSuccessModal({ visible, items, onClose }: Props) {
  if (!items) return null;

  const { data } = items;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/30 justify-center items-center px-4">
        <View className="bg-surface border border-border w-full max-w-md rounded-xl p-6">
          <Text className="text-h2 text-text-primary text-center">Booking confirmed</Text>
          <Text className="text-sm text-text-secondary text-center mt-1 mb-5">
            {items.message}
          </Text>

          <View className="items-center mb-5">
            <StatusBadge label={data.status} variant={statusVariant(data.status)} />
          </View>

          <View className="border-t border-border pt-4">
            <DetailRow label="Pet" value={data.pet} />
            <DetailRow label="Date" value={data.appointmentDisplay?.date} />
            <DetailRow label="Time" value={data.appointmentDisplay?.time} />
            <DetailRow label="Service" value={data.serviceType} />
            <DetailRow label="Reference" value={data.bookingCode} />
            <DetailRow label="Booked on" value={data.bookedAt} />
          </View>

          <View className="mt-6">
            <AppButton label="View appointments" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
