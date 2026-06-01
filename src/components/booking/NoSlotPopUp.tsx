import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    title: string;
    description?: string;
    buttonLabel?: string;
    onPress?: () => void;
};

export default function NoSlotPopUp({
    title,
    description,
    buttonLabel,
    onPress,
}: Props) {
    return (
        <View className="items-center">
            <Text className="text-xl font-semibold text-center mb-2">
                {title}
            </Text>

            {description && (
                <Text className="text-text-muted text-center mb-6">
                    {description}
                </Text>
            )}

            {buttonLabel && onPress && (
                <TouchableOpacity
                    onPress={onPress}
                    className="bg-black rounded-xl py-3 px-6"
                >
                    <Text className="text-white text-center font-medium">
                        {buttonLabel}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
