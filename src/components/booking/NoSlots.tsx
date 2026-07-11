import { Text, View } from "react-native";

export default function NoSlots() {
  return (
    <View className="py-8 items-center px-4">
      <Text className="text-h2 text-text-primary mb-2">No slots available</Text>
      <Text className="text-sm text-text-secondary text-center leading-5">
        There are no open time slots for this date. Try selecting another day.
      </Text>
    </View>
  );
}
