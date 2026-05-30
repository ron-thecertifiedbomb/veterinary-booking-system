import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    Modal,
    Platform,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import BookingForm from "@/components/booking/BookingForm";
import Loader from "@/components/common/Loader/Loader";
import { Slot } from "@/features/appointment/types";
import { formatSlotTime } from "@/utils/formatter";
import { formatDate } from "@/utils/dateandtime/date";
import { Pet } from "@/features/pet/types";
import { router } from "expo-router";
import { logger } from "@/utils/logger";

type Props = {
    visible: boolean;
    pets: Pet[] | [];
    slots: Slot[];
    checking: boolean;
    creating: boolean;
    error?: string | null;
    onClose: () => void;
    onSubmit: (data: {
        petId: string; // ✅ use ID internally
        petName: string; // ✅ still pass name (if backend needs it)
        serviceType: string;
        time: string;
        notes?: string;
    }) => Promise<void> | void;
    date: string;
    timeDisplay: string;
};

export default function BookingModal({
    visible,
    pets,
    date,
    slots = [],
    checking,
    creating,
    error,
    onClose,
    onSubmit,
}: Props) {
    const [selectedPetId, setSelectedPetId] = useState("");
    const [serviceType, setServiceType] = useState("Checkup");
    const [selectedTime, setSelectedTime] = useState("");
    const [notes, setNotes] = useState("");

    const availableSlots = slots.filter((slot) => slot.available);
    const hasAvailableSlots = availableSlots.length > 0;
    const isEmpty = pets.length === 0;

    const isValid =
        selectedPetId &&
        serviceType &&
        selectedTime;

    // ✅ Auto-select first pet
    useEffect(() => {
        if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(pets[0].id);
        }
    }, [pets]);

    const resetForm = () => {
        setSelectedPetId("");
        setServiceType("Checkup");
        setSelectedTime("");
        setNotes("");
    };
    const selectedPet = pets.find(p => p.id === selectedPetId);
    logger.info('Pet ID', selectedPet?.id)

    const handleClose = () => {
        if (creating) return;

        Keyboard.dismiss();
        onClose();
        resetForm();
    };

    const handleSubmit = async () => {
        if (!isValid || creating) return;

        Keyboard.dismiss();



        await onSubmit({
            petId: selectedPet?.id || "",
            petName: selectedPet?.name || "",
            serviceType,
            time: selectedTime,
            notes,
        });

        resetForm();
    };

    const handleAddPet = () => {
        const isWeb = Platform.OS === "web";

        router.push(
            isWeb
                ? "/(web)/add-pet"
                : "/(app)/add-pet"
        );
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <Pressable
                className="flex-1 bg-black/30 justify-center items-center px-4"
                onPress={handleClose}
            >
                <Pressable
                    className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md"
                    onPress={(e) => e.stopPropagation()}
                >

                    {/* ✅ LOADING */}
                    {checking ? (
                        <View className="items-center py-6">
                            <Loader />
                        </View>

                    ) : error && !hasAvailableSlots ? (

                        /* ✅ API ERROR */
                        <>
                            <Text className="text-red-600 text-xl font-semibold text-center mb-2">
                                Connection Error
                            </Text>

                            <Text className="text-text-muted text-center mb-6">
                                {error}
                            </Text>

                            <TouchableOpacity
                                onPress={handleClose}
                                className="bg-black rounded-xl py-3"
                            >
                                <Text className="text-white text-center font-medium">
                                    Close
                                </Text>
                            </TouchableOpacity>
                        </>

                    ) : !hasAvailableSlots ? (

                        /* ✅ NO AVAILABLE SLOTS */
                        <>
                            <Text className="text-xl font-semibold text-center mb-2">
                                No Slots Available
                            </Text>
                            <Text className="text-text-muted text-center mb-6">
                                All appointment slots are unavailable.
                                {"\n"}Please choose another date.
                            </Text>
                            <TouchableOpacity
                                onPress={handleClose}
                                className="bg-black rounded-xl py-3"
                            >
                                <Text className="text-white text-center font-medium">
                                    Choose Another Date
                                </Text>
                            </TouchableOpacity>
                        </>

                    ) : (

                        <>
                            {isEmpty ? (

                                /* ✅ NO PETS */
                                <View className="items-center p-6">
                                    <Text className="text-4xl mb-3">🐾</Text>

                                    <Text className="text-lg font-semibold">
                                        No pets yet
                                    </Text>

                                    <Text className="text-text-secondary text-center mt-1">
                                        Add your first pet to start booking.
                                    </Text>

                                    <Pressable
                                        className="bg-black rounded-xl px-6 py-3 mt-5"
                                        onPress={handleAddPet}
                                    >
                                        <Text className="text-white font-semibold">
                                            Add Pet
                                        </Text>
                                    </Pressable>
                                </View>

                            ) : (

                                <>
                                    {/* ✅ HEADER */}
                                    <Text className="text-lg font-semibold mb-2">
                                        Setup an Appointment
                                    </Text>

                                    <Text className="text-xs text-text-secondary mb-4">
                                        Selected Date: {formatDate(date)}
                                    </Text>

                                    {/* ✅ PET PICKER */}
                                    <View className="border border-border rounded-xl mb-4 p-2">
                                        <Picker
                                            selectedValue={selectedPetId}
                                            enabled={!creating}
                                            onValueChange={(value) =>
                                                setSelectedPetId(String(value))
                                            }
                                                            style={
                                                                Platform.OS === "web"
                                                                    ? ({ outlineStyle: "none" } as any)
                                                                    : undefined
                                                            }
                                        >
                                            <Picker.Item
                                                label="Select your pet..."
                                                value=""
                                                color="#9CA3AF"
                                            />

                                            {pets.map((pet) => (
                                                <Picker.Item
                                                    key={pet.id}
                                                    label={pet.name}
                                                    value={pet.id}
                                                />
                                            ))}
                                        </Picker>
                                    </View>

                                    {/* ✅ TIME PICKER */}
                                                    <View className="border border-border rounded-xl mb-4 p-2">
                                        <Picker
                                            selectedValue={selectedTime}
                                            enabled={!creating}
                                            onValueChange={(value) =>
                                                setSelectedTime(String(value))
                                            }
                                                            style={
                                                                Platform.OS === "web"
                                                                    ? ({ outlineStyle: "none" } as any)
                                                                    : undefined
                                                            }
                                        >
                                            <Picker.Item
                                                label="Select a time..."
                                                value=""
                                                color="#9CA3AF"
                                            />

                                            {availableSlots.map((slot) => (
                                                <Picker.Item
                                                    key={slot.time}
                                                    label={formatSlotTime(slot.time)}
                                                    value={slot.time}
                                                />
                                            ))}
                                        </Picker>
                                    </View>

                                    {/* ✅ FORM */}
                                    <BookingForm
                                        serviceType={serviceType}
                                        notes={notes}
                                        setServiceType={setServiceType}
                                        setNotes={setNotes}
                                    />

                                    {/* ✅ ERROR */}
                                    {error && (
                                        <View className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
                                            <Text className="text-red-600 text-center text-sm">
                                                {error}
                                            </Text>
                                        </View>
                                    )}

                                    {/* ✅ ACTIONS */}
                                    <View className="flex-row gap-3">
                                        <TouchableOpacity
                                            disabled={creating}
                                            onPress={handleClose}
                                            className="flex-1 border border-border rounded-lg py-3"
                                        >
                                            <Text className="text-center text-text-secondary">
                                                Cancel
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            disabled={!isValid || creating}
                                            onPress={handleSubmit}
                                            className={`flex-1 rounded-lg py-3 ${isValid && !creating
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
                                </>
                            )}
                        </>
                    )}
                </Pressable>
            </Pressable>
        </Modal>
    );
}