import { Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import BookingModal from "@/components/booking/BookingModal";


type SelectItem = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    items?: SelectItem[];
    placeholder?: string;
    disabled?: boolean;
};

export default function AppSelect({
    label,
    value,
    onChange,
    items = [],
    placeholder = "Select an option...",
    disabled = false,
}: Props) {
    const [open, setOpen] = useState(false);

    const selectedItem = items.find((i) => i.value === value);

    return (
        <View>
            {/* ✅ LABEL */}
            {label && (
                <Text className="text-sm text-gray-500 mb-1">
                    {label}
                </Text>
            )}

            {/* ✅ FIELD (TRANSPARENT, REPLACES PICKER) */}
            <TouchableOpacity
                disabled={disabled}
                onPress={() => setOpen(true)}
                className="border border-border rounded-xl px-4 py-3 mb-2 bg-transparent"
            >
                <Text
                    className={`${
                        selectedItem ? "text-black" : "text-gray-400"
                    }`}
                >
                    {selectedItem?.label || placeholder}
                </Text>
            </TouchableOpacity>

            {/* ✅ USE YOUR MODAL */}
            <BookingModal
                visible={open}
                onClose={() => setOpen(false)}
            >
                <View>
                    {/* ✅ TITLE */}
                    <Text className="text-lg font-semibold mb-4">
                        {label || "Select option"}
                    </Text>

                    {/* ✅ OPTIONS */}
                    {items.map((item) => {
                        const isSelected = item.value === value;

                        return (
                            <TouchableOpacity
                                key={item.value}
                                onPress={() => {
                                    onChange(item.value);
                                    setOpen(false);
                                }}
                                className={`p-4 rounded-xl mb-2 ${
                                    isSelected
                                        ? "bg-cyan-50"
                                        : "bg-transparent"
                                }`}
                            >
                                <Text
                                    className={`${
                                        isSelected
                                            ? "text-cyan-600 font-medium"
                                            : "text-black"
                                    }`}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </BookingModal>
        </View>
    );
}