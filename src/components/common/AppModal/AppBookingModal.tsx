import { useState } from "react";
import { Text, View } from "react-native";
import BookingModal from "@/components/booking/BookingModal";
import BookingForm from "@/components/booking/BookingForm";
import { Pet } from "@/features/pet/types";
import { Slot } from "@/features/appointment/types";

type Props = {
    pets: Pet[];
    slots: Slot[];
    date: string;
    creating?: boolean;

    visible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

export default function AppBookingModal({
    pets,
    slots,
    date,
    creating = false,
    visible,
    onClose,
    onSubmit,
}: Props) {
    // ✅ LOCAL FORM STATE
    const [selectedPetId, setSelectedPetId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [notes, setNotes] = useState("");

    // ✅ DERIVED LOGIC
    const availableSlots = slots.filter((s) => s.available);

    const isPetsEmpty = pets.length === 0;
    const isSlotsEmpty = availableSlots.length === 0;

    return (
        <BookingModal visible={visible} onClose={onClose}>
            {/* ✅ NO PETS */}
            {isPetsEmpty && (
                <View className="py-10 items-center">
                    <Text className="text-lg font-semibold mb-2">
                        No Pets Found
                    </Text>
                    <Text className="text-gray-500 text-center">
                        Please add a pet first before booking an appointment.
                    </Text>
                </View>
            )}

            {/* ✅ NO SLOTS */}
            {!isPetsEmpty && isSlotsEmpty && (
                <View className="py-10 items-center">
                    <Text className="text-lg font-semibold mb-2">
                        No Available Slots
                    </Text>
                    <Text className="text-gray-500 text-center">
                        There are no available time slots for this date.
                        Please select another date.
                    </Text>
                </View>
            )}

            {/* ✅ NORMAL FORM */}
            {!isPetsEmpty && !isSlotsEmpty && (
                <BookingForm
                    pets={pets}
                    slots={slots}
                    date={date}
                    selectedPetId={selectedPetId}
                    selectedTime={selectedTime}
                    serviceType={serviceType}
                    notes={notes}
                    setSelectedPetId={setSelectedPetId}
                    setSelectedTime={setSelectedTime}
                    setServiceType={setServiceType}
                    setNotes={setNotes}
                    creating={creating}
                    handleSubmit={() =>
                        onSubmit({
                            petId: selectedPetId,
                            petName:
                                pets.find((p) => p.id === selectedPetId)?.petName || "",
                            serviceType,
                            time: selectedTime,
                            notes,
                        })
                    }
                    handleClose={onClose}
                />
            )}
        </BookingModal>
    );
}
