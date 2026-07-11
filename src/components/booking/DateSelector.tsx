import { colors } from "@/theme/tokens";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";

type Props = {
  date: string;
  onDateChange: (date: string) => void;
  onContinue?: () => void;
};

export default function DateSelector({ date, onDateChange, onContinue }: Props) {
  return (
    <View className="p-1">
      <Calendar
        current={date}
        onDayPress={(day) => {
          onDateChange(day.dateString);
          onContinue?.();
        }}
        markedDates={{
          [date]: {
            selected: true,
            selectedColor: colors.accent,
            selectedTextColor: colors.text.inverse,
          },
        }}
        theme={{
          arrowColor: colors.accent,
          todayTextColor: colors.accent,
          textMonthFontWeight: "600",
          textDayFontSize: 14,
          textMonthFontSize: 15,
          textDayHeaderFontSize: 11,
          calendarBackground: colors.surface,
          dayTextColor: colors.text.primary,
          monthTextColor: colors.text.primary,
          textDisabledColor: colors.text.muted,
          textSectionTitleColor: colors.text.muted,
        }}
      />
    </View>
  );
}
