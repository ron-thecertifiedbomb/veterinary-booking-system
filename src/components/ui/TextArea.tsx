import { colors } from "@/theme/tokens";
import { Platform, Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  error?: string | null;
};

export default function TextArea({
  label,
  error,
  className = "",
  ...props
}: Props) {
  return (
    <View>
      <Text className="text-xs font-medium text-text-secondary mb-1.5">{label}</Text>
      <TextInput
        multiline
        placeholderTextColor={colors.text.muted}
        textAlignVertical="top"
        className={`bg-surface border rounded-lg px-3 py-2.5 text-body text-text-primary min-h-[88px] ${
          error ? "border-danger" : "border-border"
        } ${className}`}
        style={
          Platform.OS === "web"
            ? ({ outlineStyle: "none" } as any)
            : undefined
        }
        {...props}
      />
      {error ? <Text className="text-danger text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
