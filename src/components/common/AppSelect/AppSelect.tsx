import { Picker } from "@react-native-picker/picker";
import { Platform, Text, View } from "react-native";

type SelectItem = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    items: SelectItem[];
    placeholder?: string;
    disabled?: boolean;
};

const PLACEHOLDER_COLOR = "#9CA3AF";

export default function AppSelect({
    label,
    value,
    onChange,
    items,
    placeholder = "Select an option...",
    disabled = false,
}: Props) {
    return (
        <View>
            {/* ✅ LABEL */}
            {label && (
                <Text className="text-sm text-gray-500 mb-1">
                    {label}
                </Text>
            )}

            {/* ✅ SELECT BOX */}
            <View className="border border-border rounded-xl mb-2 overflow-hidden">
                <Picker
                    selectedValue={value}
                    enabled={!disabled}
                    onValueChange={(val) => onChange(String(val))}
                    style={
                        Platform.OS === "web"
                            ? ({
                                outlineStyle: "none",
                                backgroundColor: "transparent",
                            } as any)
                            : undefined
                    }
                >
                    {/* ✅ PLACEHOLDER */}
                    <Picker.Item
                        label={placeholder}
                        value=""
                        color={PLACEHOLDER_COLOR}
                    />

                    {/* ✅ OPTIONS */}
                    {items.map((item) => (
                        <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}