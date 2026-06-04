import { Platform, Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type AppTextInputProps = {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    error?: string | null;
    keyboardType?: "default" | "email-address";
    secureTextEntry?: boolean;
    autoComplete?: TextInputProps["autoComplete"];
    name?: string;
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
    autoComplete,
    name,
    rightIcon,
    onRightIconPress,
}: AppTextInputProps) {
    return (
        <View className="mb-[0.7px]">

            {/* LABEL */}
            <Text className="text-sm font-medium text-text-primary mb-1">
                {label}
            </Text>

            {/* INPUT */}
            <View className="bg-surface border border-gray-300 rounded-2xl mb-1 flex-row items-center">

                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize="none"
                    autoCorrect={false}

                    // ✅ WEB FIXES
                    {...(Platform.OS === "web"
                        ? ({
                            autoComplete:
                                autoComplete ||
                                (secureTextEntry
                                    ? "current-password"
                                    : keyboardType === "email-address"
                                        ? "email"
                                        : "on"),
                            name: name || label.toLowerCase(),
                        } as any)
                        : {})}

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
            <Text className="text-red-500 text-xs  min-h-[16px]">
                {error ?? ""}
            </Text>

        </View>
    );
}
``