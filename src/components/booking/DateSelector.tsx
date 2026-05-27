import { View } from "react-native";
import { Calendar } from "react-native-calendars";

type Props = {
    date: string;
    onDateChange: (date: string) => void;
    onContinue?: () => void;
};

export default function DateSelector({
    date,
    onDateChange,
    onContinue,
}: Props) {
    return (
        <View>


            {/* ✅ Calendar */}
            <View className="bg-surface border border-border rounded-xl p-4">

                <Calendar
                    current={date}
                    minDate={new Date().toLocaleDateString("en-CA")}
                    onDayPress={(day) => {
                        onDateChange(day.dateString);
                        onContinue?.();
                    }}
                    markedDates={{
                        [date]: {
                            selected: true,
                            selectedColor: "#111827",
                            selectedTextColor: "#ffffff",
                        },
                    }}

                    // ✅ ADD THIS
                    theme={{
                        arrowColor: "#000000",
                    }}
                />

            </View>

            {/* {onContinue && (
                <TouchableOpacity
                    onPress={onContinue}
                    className="bg-surfaceSoft border border-border rounded-xl py-4 mt-6"
                >
                    <Text className="text-center text-text-primary font-medium">
                        Continue Booking
                    </Text>
                </TouchableOpacity>
            )} */}
        </View>
    );
}