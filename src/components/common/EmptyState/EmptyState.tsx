import AppButton from "@/components/ui/AppButton";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { colors, iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
  buttonLabel?: string;
  onPress?: () => void;
};

export default function EmptyState({ title, description, buttonLabel, onPress }: Props) {
  const { isCompact } = useIsCompactScreen();

  return (
    <View className={isCompact ? "py-8 px-1" : "py-10 px-2"}>
      <View
        className={`bg-surface border border-border rounded-xl items-center ${
          isCompact ? "px-6 py-8" : "px-8 py-10"
        }`}
      >
        <View className="w-12 h-12 rounded-full bg-surfaceMuted items-center justify-center mb-5">
          <Ionicons name="calendar-outline" size={iconSize.xl} color={colors.text.muted} />
        </View>
        <Text className="text-h2 text-text-primary text-center font-semibold font-sans">{title}</Text>

        {description ? (
          <Text className="text-sm text-text-secondary text-center mt-2 leading-5 max-w-sm font-sans">
            {description}
          </Text>
        ) : null}

        {buttonLabel && onPress ? (
          <View className="mt-8 w-full max-w-xs">
            <AppButton label={buttonLabel} onPress={onPress} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
