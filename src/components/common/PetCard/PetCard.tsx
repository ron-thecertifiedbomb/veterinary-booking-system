import { Text, View } from "react-native";
import AppPetCard from "../AppPetCard/AppPetCard";


export default function PetCard({ item, onPress }: any) {
    return (
        <AppPetCard onPress={onPress}>
            <View className="flex-row items-center">
                
                {/* ✅ AVATAR */}
                <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mr-4">
                    <Text className="text-4xl">
                        {item.species === "Dog" ? "🐶" : "🐱"}
                    </Text>
                </View>

                {/* ✅ INFO */}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                        {item.petName}
                    </Text>

                    <Text className="text-sm text-gray-500 mt-[2px]">
                        {item.species} • {item.breed || "Unknown"}
                    </Text>

                    <Text className="text-xs text-gray-400 mt-1">
                        {item.weight} kg
                    </Text>
                </View>

                {/* ✅ RIGHT SIDE */}
                <View className="items-end">
                    <View className="px-2 py-[2px] rounded-full bg-green-50 mb-2">
                        <Text className="text-[10px] text-green-600 font-medium">
                            Active
                        </Text>
                    </View>

                    <Text className="text-gray-300 text-lg">
                        ›
                    </Text>
                </View>
            </View>
        </AppPetCard>
    );
}