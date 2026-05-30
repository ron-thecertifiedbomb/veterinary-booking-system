// src/components/common/EmptyState/EmptyState.tsx

import {
    Pressable,
    Text,
    View,
} from "react-native";

type Props = {
    icon?: string;

    title: string;

    description?: string;

    buttonLabel?: string;

    onPress?: () => void;
};

export default function EmptyState({
    icon = "📭",
    title,
    description,
    buttonLabel,
    onPress,
}: Props) {
    return (
        <View className="bg-surface border border-border rounded-2xl p-6 items-center">
            {/* ✅ ICON */}
            <Text className="text-4xl mb-3">
                {icon}
            </Text>

            {/* ✅ TITLE */}
            <Text className="text-lg font-semibold text-text-primary">
                {title}
            </Text>

            {/* ✅ DESCRIPTION */}
            {description && (
                <Text className="text-sm text-text-secondary text-center mt-1">
                    {description}
                </Text>
            )}

            {/* ✅ ACTION */}
            {buttonLabel && onPress && (
                <Pressable
                    className="bg-black rounded-xl px-6 py-3 mt-5 active:opacity-80"
                    onPress={onPress}
                >
                    <Text className="text-white font-semibold text-sm">
                        {buttonLabel}
                    </Text>
                </Pressable>
            )}
        </View>
    );
}