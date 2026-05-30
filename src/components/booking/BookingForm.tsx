import { View, Text, TextInput, Pressable, Platform } from "react-native";
import { useState } from "react";
import { logger } from "@/utils/logger";
import { Picker } from "@react-native-picker/picker";

type Props = {
    serviceType: string;
    notes: string;
    setServiceType: (v: string) => void;
    setNotes: (v: string) => void;
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
    serviceType,
    notes,
    setServiceType,
    setNotes,
}: Props) {

    return (
        <View className="gap-4 mb-5">
            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Service Type
                </Text>
                <View className="border border-border rounded-xl mb-4 p-2">
                    <Picker
                        selectedValue={serviceType}
                        onValueChange={(value) => {
                            setServiceType(String(value));
                        }}
                        style={
                            Platform.OS === "web"
                                ? ({ outlineStyle: "none" } as any)
                                : undefined
                        }
                    >
                        {SERVICES.map((item) => (
                            <Picker.Item
                                key={item}
                                label={item}
                                value={item}
                            />
                        ))}
                    </Picker>
                </View>
            </View>
            <View>
                <Text className="text-xs text-gray-500 mb-1">
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
                    numberOfLines={3}
                    className="border border-gray-300 rounded-xl px-4 py-3 text-text-primary"
                />
            </View>

        </View>
    );
}
