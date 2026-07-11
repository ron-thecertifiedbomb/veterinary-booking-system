import { Picker } from "@react-native-picker/picker";
import { Platform, Text, View } from "react-native";

type Option<T extends string> = {
  label: string;
  value: T;
};

type Props<T extends string> = {
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  options: Option<T>[];
  error?: string | null;
};

export default function FormSelect<T extends string>({
  label,
  value,
  onValueChange,
  options,
  error,
}: Props<T>) {
  return (
    <View>
      <Text className="text-xs font-medium text-text-secondary mb-2 font-sans">{label}</Text>
      <View
        className={`bg-surface border rounded-lg min-h-[48px] justify-center overflow-hidden ${
          error ? "border-danger" : "border-border"
        }`}
      >
        <Picker
          selectedValue={value}
          onValueChange={(next) => onValueChange(next as T)}
          style={
            Platform.OS === "web"
              ? ({
                  width: "100%",
                  border: "none",
                  outline: "none",
                  backgroundColor: "transparent",
                  fontFamily: "Inter, sans-serif",
                  fontSize: 15,
                  color: "#18181B",
                } as any)
              : undefined
          }
        >
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      {error ? <Text className="text-danger text-xs mt-1.5 font-sans">{error}</Text> : null}
    </View>
  );
}
