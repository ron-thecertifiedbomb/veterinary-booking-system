import { formatReadableDate } from "@/utils/appointments/formatter";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
// Adjust import path based on your layout

interface DateField {
  label: string;
  value?: string; 
  type: "from" | "to";
}

interface DateRangePickerProps {
  fromValue?: string; 
  toValue?: string;   
  onPress: (type: "from" | "to") => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  fromValue,
  toValue,
  onPress,
}) => {
  const fields: DateField[] = [
    { label: "From Date", value: fromValue, type: "from" },
    { label: "To Date", value: toValue, type: "to" },
  ];

  return (
    <View className="flex-row items-center justify-between px-4 mb-4 gap-x-3">
      {fields.map((field) => {
        // Change text color slightly if the value is null to indicate an empty state
        const isSelected = field.value !== null;
        const textColor = isSelected 
          ? "text-gray-800 dark:text-gray-100" 
          : "text-gray-400 dark:text-zinc-500";

        return (
          <View key={field.type} className="flex-1">
            <Text className="text-xs text-gray-500 font-medium mb-1 pl-1">
              {field.label}
            </Text>
            <TouchableOpacity
              onPress={() => onPress(field.type)}
              className="flex-row items-center justify-between bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-3 rounded-xl"
              activeOpacity={0.7}
            >
              <Text className={`text-sm font-medium ${textColor}`}>
                {formatReadableDate(field.value)}
              </Text>
              <Text className="text-base text-gray-400">📅</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};
