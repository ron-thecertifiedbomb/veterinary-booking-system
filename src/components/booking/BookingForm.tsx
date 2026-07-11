import AppButton from "@/components/ui/AppButton";
import AppSelect from "@/components/common/AppSelect/AppSelect";
import TextArea from "@/components/ui/TextArea";
import { Pet } from "@/features/pet/pet.types";
import { Slot } from "@/hooks/appointments/useBookingSystem";
import { formatDate, formatSlotTime } from "@/utils/appointments/formatter";
import { Text, View } from "react-native";

type Props = {
  pets: Pet[];
  slots?: Slot[];
  selectedPetId: string;
  selectedTime: string;
  date: string;
  serviceType: string;
  notes: string;
  setSelectedPetId: (v: string) => void;
  setSelectedTime: (v: string) => void;
  setServiceType: (v: string) => void;
  setNotes: (v: string) => void;
  handleSubmit: () => void;
  handleClose: () => void;
  creating?: boolean;
};

const SERVICES = ["Checkup", "Vaccination", "Grooming", "Surgery", "Dental"];

export default function BookingForm({
  pets,
  slots,
  selectedPetId,
  selectedTime,
  serviceType,
  notes,
  date,
  setSelectedPetId,
  setSelectedTime,
  setServiceType,
  setNotes,
  handleSubmit,
  handleClose,
  creating = false,
}: Props) {
  const isValid = !!selectedPetId && !!selectedTime && !!serviceType;

  return (
    <View>
      <Text className="text-h2 text-text-primary">Book appointment</Text>
      <Text className="text-sm text-text-secondary mt-1 mb-5">
        {formatDate(date)}
      </Text>

      <View className="gap-4">
        <AppSelect
          label="Pet"
          value={selectedPetId}
          onChange={setSelectedPetId}
          placeholder="Choose a pet"
          items={pets.map((pet) => ({ label: pet.petName, value: pet.id }))}
          disabled={creating}
        />

        <AppSelect
          label="Time"
          value={selectedTime}
          onChange={setSelectedTime}
          placeholder="Choose a time slot"
          items={slots?.map((slot) => ({
            label: formatSlotTime(slot.time),
            value: slot.time,
          }))}
          disabled={creating}
        />

        <AppSelect
          label="Service"
          value={serviceType}
          onChange={setServiceType}
          placeholder="Select service"
          items={SERVICES.map((s) => ({ label: s, value: s }))}
          disabled={creating}
        />

        <TextArea
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any special instructions for the clinic"
          editable={!creating}
        />
      </View>

      <View className="flex-row gap-3 mt-6">
        <View className="flex-1">
          <AppButton label="Cancel" onPress={handleClose} variant="secondary" disabled={creating} />
        </View>
        <View className="flex-1">
          <AppButton
            label="Confirm"
            onPress={handleSubmit}
            loading={creating}
            disabled={!isValid}
          />
        </View>
      </View>
    </View>
  );
}
