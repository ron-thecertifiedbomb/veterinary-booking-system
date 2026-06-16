// src/components/common/EmptyState/EmptyState.tsx

import {
    Pressable,
    Text,
    View,
} from "react-native";

type Props = {
    title: string;
    description?: string;
    buttonLabel?: string;
    onPress?: () => void;
};

export default function EmptyState({
    title,
    description,
    buttonLabel,
    onPress,
}: Props) {
    return (
        <View className="flex-1 justify-center lg:px-14">

            {/* ✅ CARD */}
            <View className="w-full  bg-surface border border-border rounded-2xl p-8 shadow-sm">

                {/* ✅ TITLE */}
                <Text className="text-xl font-semibold text-text-primary text-center tracking-tight">
                    {title}
                </Text>

                {/* ✅ DESCRIPTION */}
                {description && (
                    <Text className="text-sm text-text-secondary text-center mt-2 leading-5">
                        {description}
                    </Text>
                )}

                {buttonLabel && onPress && (
                    <Pressable
                        onPress={onPress}
                        className="mt-6 w-full rounded-xl py-3 bg-black border border-white/10"
                        style={({ pressed }) => ({
                            transform: [{ scale: pressed ? 0.97 : 1 }],
                            shadowColor: "#000",
                            shadowOpacity: 0.28,
                            shadowRadius: 10,
                            shadowOffset: { width: 0, height: 6 },
                            elevation: 6,
                            opacity: pressed ? 0.9 : 1,
                        })}
                    >
                        {/* ✅ Button Content */}
                        <View className="flex-row items-center justify-center gap-2">
                            {/* OPTIONAL ICON — remove if ayaw */}
                            {/* <Text className="text-white text-sm">✨</Text> */}

                            <Text className="text-white text-center font-semibold text-sm tracking-wide">
                                {buttonLabel}
                            </Text>
                        </View>

                        {/* ✅ Glossy highlight (premium effect) */}
                        <View
                            pointerEvents="none"
                            className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-white/10"
                        />
                    </Pressable>
                )}

            </View>
        </View>
    );
}