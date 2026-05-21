 
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function HistoryScreen() {
   
    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="px-6 pt-8 pb-4">
                <View className="w-full max-w-xl mx-auto px-4">
                    <Text className="text-2xl font-semibold text-text-primary">
                     History Screen
                    </Text>

                    <Text className="text-sm text-text-muted mt-1">
                        Review and manage appointment requests
                    </Text>
                </View>
            </View>

        </SafeAreaView>
    );
}