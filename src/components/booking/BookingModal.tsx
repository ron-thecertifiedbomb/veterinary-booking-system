import {
    View,
    Text,
    Modal,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import { Slot } from "@/hooks/useBookingSystem";
import { formatTime } from "@/utils/date";
import BookingForm from "@/components/booking/BookingForm";

type Props = {
    visible: boolean;
    slots: Slot[];
    onClose: () => void;
    onSubmit: (data: {
        ownerName: string;
        petName: string;
        serviceType: string;
        time: string;
    }) => void;
};

export default function BookingModal({
    visible,
    slots,
    onClose,
    onSubmit,
}: Props) {
    const [ownerName, setOwnerName] = useState("");
    const [petName, setPetName] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const isValid =
        ownerName && petName && serviceType && selectedTime;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/30 justify-center items-center px-4">
                <View className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">

                    <Text className="text-text-primary font-semibold text-lg mb-4">
                        Complete Booking
                    </Text>

                    {/* ✅ TIME */}
                    <Text className="text-xs text-text-muted mb-2">
                        Select Time
                    </Text>

                    <View className="bg-surface border border-border rounded-xl mb-4">
                        <Picker
                            selectedValue={selectedTime}
                            onValueChange={setSelectedTime}
                        >
                            <Picker.Item label="Select a time..." value="" />


                            {slots
                                .filter((slot) => slot.available === true)
                                .map((slot) => (
                                    <Picker.Item
                                        key={slot.time}
                                        label={formatTime(slot.time)}
                                        value={slot.time}
                                    />
                                ))}

                        </Picker>
                    </View>

                    {/* ✅ FORM (EXTRACTED) */}
                    <BookingForm
                        ownerName={ownerName}
                        petName={petName}
                        serviceType={serviceType}
                        setOwnerName={setOwnerName}
                        setPetName={setPetName}
                        setServiceType={setServiceType}
                    />

                    {/* ✅ ACTIONS */}
                    <View className="flex-row gap-3">

                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 border border-border rounded-lg py-3"
                        >
                            <Text className="text-center text-text-secondary">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            disabled={!isValid}
                            onPress={() => {
                                onSubmit({
                                    ownerName,
                                    petName,
                                    serviceType,
                                    time: selectedTime,
                                });

                                setOwnerName("");
                                setPetName("");
                                setServiceType("");
                                setSelectedTime("")
                                onClose();
                            }}
                            className={`flex-1 rounded-lg py-3 ${isValid
                                    ? "bg-surfaceSoft border border-border"
                                    : "bg-gray-300"
                                }`}
                        >
                            <Text className="text-center text-text-primary font-medium">
                                Confirm
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>
            </View>
        </Modal>
    );
}