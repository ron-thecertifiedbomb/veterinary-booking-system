
import { Text, View } from "react-native";

export default function NoSlots() {
    return (
        <View className="py-10 items-center">
            <Text className="text-lg font-semibold mb-2">
                No Available Slots
            </Text>
            <Text className="text-gray-500 text-center">
                There are no available time slots for this date.
                Please select another date.
            </Text>
        </View>
    );
}
