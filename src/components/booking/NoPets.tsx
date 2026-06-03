import { Text, View } from "react-native";

export default function NoPets() {
    return (
        <View className="py-10 items-center">
            <Text className="text-lg font-semibold mb-2">
                No Pets Found
            </Text>
            <Text className="text-gray-500 text-center">
                Please add a pet first before booking an appointment.
            </Text>
        </View>
    );
}