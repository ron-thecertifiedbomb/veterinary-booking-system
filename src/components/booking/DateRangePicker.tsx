import { formatReadableDate } from "@/utils/appointments/formatter";
import { colors, iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  fromValue?: string;
  toValue?: string;
  onPress: (type: "from" | "to") => void;
  onClear?: () => void;
};

export function DateRangePicker({ fromValue, toValue, onPress, onClear }: Props) {
  const hasCustomRange = Boolean(fromValue || toValue);

  return (
    <View className="mb-5">
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Text className="text-xs font-medium text-text-secondary mb-2 font-sans">From</Text>
          <Pressable
            onPress={() => onPress("from")}
            className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between min-h-[48px]"
          >
            <Text className="text-sm text-text-primary font-sans">
              {fromValue ? formatReadableDate(fromValue) : "Any date"}
            </Text>
            <Ionicons name="calendar-outline" size={iconSize.md} color={colors.text.muted} />
          </Pressable>
        </View>

        <View className="flex-1">
          <Text className="text-xs font-medium text-text-secondary mb-2 font-sans">To</Text>
          <Pressable
            onPress={() => onPress("to")}
            className="bg-surface border border-border rounded-lg px-4 py-3 flex-row items-center justify-between min-h-[48px]"
          >
            <Text className="text-sm text-text-primary font-sans">
              {toValue ? formatReadableDate(toValue) : "Any date"}
            </Text>
            <Ionicons name="calendar-outline" size={iconSize.md} color={colors.text.muted} />
          </Pressable>
        </View>
      </View>

      {hasCustomRange && onClear ? (
        <Pressable onPress={onClear} className="mt-3 self-start">
          <Text className="text-sm font-medium text-text-secondary font-sans">Clear custom range</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
