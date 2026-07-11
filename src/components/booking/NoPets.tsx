import { Text, View } from "react-native";

export default function NoPets() {
  return (
    <View className="py-8 items-center px-4">
      <Text className="text-h2 text-text-primary mb-2">No pets found</Text>
      <Text className="text-sm text-text-secondary text-center leading-5">
        Add a pet to your account before booking an appointment.
      </Text>
    </View>
  );
}
