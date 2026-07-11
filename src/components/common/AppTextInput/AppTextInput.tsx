import { colors } from "@/theme/tokens";
import { Platform, Pressable, Text, TextInput, TextInputProps, View } from "react-native";

type AppTextInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string | null;
  keyboardType?: "default" | "email-address";
  secureTextEntry?: boolean;
  autoComplete?: TextInputProps["autoComplete"];
  name?: string;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
};

export default function AppTextInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
  secureTextEntry = false,
  autoComplete,
  name,
  rightIcon,
  onRightIconPress,
}: AppTextInputProps) {
  return (
    <View>
      <Text className="text-xs font-medium text-text-secondary mb-2 font-sans">{label}</Text>
      <View
        className={`bg-surface border rounded-lg flex-row items-center min-h-[48px] ${
          error ? "border-danger" : "border-border"
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.muted}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          {...(Platform.OS === "web"
            ? ({
                autoComplete:
                  autoComplete ||
                  (secureTextEntry
                    ? "current-password"
                    : keyboardType === "email-address"
                      ? "email"
                      : "on"),
                name: name || label.toLowerCase(),
              } as any)
            : {})}
          className="flex-1 px-4 py-3 text-body text-text-primary font-sans"
          style={
            Platform.OS === "web"
              ? ({
                  outlineStyle: "none",
                  WebkitBoxShadow: "0 0 0px 1000px transparent inset",
                  boxShadow: "0 0 0px 1000px transparent inset",
                } as any)
              : undefined
          }
        />
        {rightIcon ? (
          <Pressable onPress={onRightIconPress} className="px-4" hitSlop={8}>
            {rightIcon}
          </Pressable>
        ) : null}
      </View>
      {error ? <Text className="text-danger text-xs mt-1.5 font-sans">{error}</Text> : null}
    </View>
  );
}
