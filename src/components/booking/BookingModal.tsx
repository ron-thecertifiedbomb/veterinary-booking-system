import {
    View,
    Text,
    Modal,
    TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import { Slot } from "@/features/booking/types";
import { formatTime } from "@/utils/date";
import BookingForm from "@/components/booking/BookingForm";

type Props = {
    visible: boolean;
    slots: Slot[];
    checking: boolean;
    onClose: () => void;
    onSubmit: (data: {
        ownerName: string;
        petName: string;
        serviceType: string;
        time: string;
    }) => Promise<void> | void;
};



export default function BookingModal({
    visible,
    slots = [],
    checking,
    onClose,
    onSubmit,
}: Props) {
    const [ownerName, setOwnerName] = useState("");
    const [petName, setPetName] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    const availableSlots = (slots ?? []).filter(
        (slot) => slot.available === true
    );

    const hasAvailableSlots = availableSlots.length > 0;

    const isValid =
        ownerName &&
        petName &&
        serviceType &&
        selectedTime;


    const resetForm = () => {
        setOwnerName("");
        setPetName("");
        setServiceType("");
        setSelectedTime("");
    };

    const handleSubmit = async () => {
        if (!isValid) return;

        await onSubmit({
            ownerName,
            petName,
            serviceType,
            time: selectedTime,
        });

        resetForm();
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/30 justify-center items-center px-4">
                <View className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
                    {checking ? (
                        <>
                            <Text className="text-text-primary font-semibold text-xl mb-2 text-center">
                                Checking Availability
                            </Text>

                            <Text className="text-text-muted text-sm text-center">
                                Please wait while available appointment slots are being checked.
                            </Text>
                        </>
                    ) : !hasAvailableSlots ? (
                        <>
                            <Text className="text-text-primary font-semibold text-xl mb-2 text-center">
                                No Slots Available
                            </Text>

                            <Text className="text-text-muted text-sm text-center mb-6">
                                All appointment slots for this date are unavailable.
                                {"\n"}Please choose another date.
                            </Text>

                            <TouchableOpacity
                                onPress={onClose}
                                className="bg-black rounded-xl py-3"
                            >
                                <Text className="text-white text-center font-medium">
                                    Choose Another Date
                                </Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text className="text-text-primary font-semibold text-lg mb-4">
                                Complete Booking
                            </Text>

                            <Text className="text-xs text-text-muted mb-2">
                                Select Time
                            </Text>

                            <View className="bg-surface border border-border rounded-xl mb-4">
                                <Picker
                                    selectedValue={selectedTime}
                                    onValueChange={(value) => setSelectedTime(String(value))}
                                >
                                    <Picker.Item label="Select a time..." value="" />

                                    {availableSlots.map((slot) => (
                                        <Picker.Item
                                            key={slot.time}
                                            label={formatTime(slot.time)}
                                            value={slot.time}
                                        />
                                    ))}
                                </Picker>
                            </View>

                            <BookingForm
                                ownerName={ownerName}
                                petName={petName}
                                serviceType={serviceType}
                                setOwnerName={setOwnerName}
                                setPetName={setPetName}
                                setServiceType={setServiceType}
                            />

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
                                    onPress={handleSubmit}
                                    className={`flex-1 rounded-lg py-3 ${isValid ? "bg-black" : "bg-gray-300"
                                        }`}
                                >
                                    <Text className="text-center text-white font-medium">
                                        Confirm
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </Modal>
    );
}