import { Pressable, Text, View, Platform } from "react-native";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function FilterChips<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View className="flex-row flex-wrap gap-2 mb-6">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className={`px-4 ${Platform.OS === "web" ? "py-2.5" : "py-3.5"} rounded-lg border ${
              active ? "bg-accent border-accent" : "bg-surface border-border"
            }`}
          >
            <Text
              className={`text-sm font-medium font-sans ${
                active ? "text-text-inverse" : "text-text-secondary"
              }`}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
