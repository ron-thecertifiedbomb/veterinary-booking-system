import { logger } from "@/utils/logger/logger";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AppSelect from "@/components/common/AppSelect/AppSelect";
import { Slot } from "@/features/appointment/types";
import { Pet } from "@/features/pet/types";
import { formatDate } from "@/utils/dateandtime/date";
import { formatSlotTime } from "@/utils/dateandtime/formatter";

type Props = {
    pets: Pet[];
    slots: Slot[];

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

const SERVICES = [
    "Checkup",
    "Vaccination",
    "Grooming",
    "Surgery",
    "Dental",
];

const PLACEHOLDER_COLOR = "#9CA3AF";

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
    const availableSlots = slots.filter((slot) => slot.available);

    const isValid =
        !!selectedPetId &&
        !!selectedTime &&
        !!serviceType;

    return (
        <View className="mb-4">
            {/* ✅ HEADER */}
            <View className="mb-5">
                <Text className="text-xl font-semibold mb-1">
                    Setup an Appointment
                </Text>

                <Text className="text-sm text-gray-500">
                    Selected Date: {formatDate(date)}
                </Text>
            </View>

            {/* ✅ FORM FIELDS */}
            <View className="mb-4">
                <AppSelect
                    label="Select Pet"
                    value={selectedPetId}
                    onChange={setSelectedPetId}
                    placeholder="Select your pet..."
                    items={pets.map((pet) => ({
                        label: pet.petName,
                        value: pet.id,
                    }))}
                    disabled={creating}
                />
            </View>

            <View className="mb-4">
                <AppSelect
                    label="Select Time"
                    value={selectedTime}
                    onChange={setSelectedTime}
                    placeholder="Select a time..."
                    items={availableSlots.map((slot) => ({
                        label: formatSlotTime(slot.time),
                        value: slot.time,
                    }))}
                    disabled={creating}
                />
            </View>

            <View className="mb-4">
                <AppSelect
                    label="Service Type"
                    value={serviceType}
                    onChange={setServiceType}
                    items={SERVICES.map((s) => ({
                        label: s,
                        value: s,
                    }))}
                    disabled={creating}
                />
            </View>

            {/* ✅ NOTES */}
            <View className="mb-5">
                <Text className="text-sm text-gray-500 mb-2">
                    Notes (Optional)
                </Text>

                <TextInput
                    value={notes}
                    onChangeText={(v) => {
                        logger.info("Notes changed", v);
                        setNotes(v);
                    }}
                    placeholder="Add any special instructions (optional)"
                    placeholderTextColor={PLACEHOLDER_COLOR}
                    multiline
                    style={{ minHeight: 90, textAlignVertical: "top" }}
                    className="border border-gray-300 rounded-xl p-4 text-black"
                />
            </View>

            {/* ✅ ACTION BUTTONS */}
            <View className="flex-row gap-3 mt-2">
                <TouchableOpacity
                    disabled={creating}
                    onPress={handleClose}
                    className="flex-1 border border-gray-300 rounded-xl py-3"
                >
                    <Text className="text-center text-gray-500 font-medium">
                        Cancel
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    disabled={!isValid || creating}
                    onPress={handleSubmit}
                    className={`flex-1 rounded-xl py-3 ${isValid && !creating
                        ? "bg-black"
                        : "bg-gray-400"
                        }`}
                >
                    {creating ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white text-center font-medium">
                            Confirm
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}