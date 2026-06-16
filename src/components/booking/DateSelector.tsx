// @/components/common/DateSelector.tsx
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
        <View className="bg-white border border-gray-200 rounded-xl p-4">
            <Calendar
                current={date}
                // Removed minDate so users can pick past booking dates
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
                theme={{
                    arrowColor: "#000000",
                }}
            />
        </View>
    );
}
