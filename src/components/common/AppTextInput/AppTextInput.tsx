import { Platform, Pressable, Text, TextInput, View } from "react-native";

type AppTextInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string | null;
    keyboardType?: "default" | "email-address";
    secureTextEntry?: boolean;

    // ✅ NEW
    rightIcon?: React.ReactNode;
    onRightIconPress?: () => void;
};

export default function AppTextInput({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
    secureTextEntry = false,
    rightIcon,
    onRightIconPress,
}: AppTextInputProps) {
    return (
        <View>

            {/* LABEL */}
            <Text className="text-sm font-medium text-text-primary mb-2">
                {label}
            </Text>

            {/* INPUT + ICON */}
            <View className="bg-surface border border-gray-300 rounded-2xl flex-row items-center">
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="flex-1 px-4 py-4 text-text-primary"
                    style={
                        Platform.OS === "web"
                            ? ({ outlineStyle: "none" } as any)
                            : undefined
                    }
                />

                {rightIcon && (
                    <Pressable onPress={onRightIconPress} className="px-4">
                        {rightIcon}
                    </Pressable>
                )}
            </View>

            {/* ERROR */}

            <Text className="text-red-500 text-xs mt-2 mb-4 min-h-[16px] ">
                {error ?? ""}
            </Text>


        </View>
    );
}