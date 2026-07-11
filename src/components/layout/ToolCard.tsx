import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { colors, iconSize } from "@/theme/tokens";

type Props = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  compact?: boolean;
};

export default function ToolCard({
  title,
  description,
  icon,
  onPress,
  compact = false,
}: Props) {
  return (
    <Pressable
      onPress={onPress}
      className={`bg-surface border border-border rounded-xl overflow-hidden ${
        compact ? "w-[148px]" : "flex-1 min-w-[140px]"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.94 : 1,
        borderColor: pressed ? colors.borderStrong : colors.border,
      })}
    >
      <View className={compact ? "p-4" : "p-5"}>
        <View
          className={`${
            compact ? "w-9 h-9 mb-3" : "w-10 h-10 mb-4"
          } rounded-lg bg-surfaceMuted items-center justify-center`}
        >
          <Ionicons name={icon} size={iconSize.lg} color={colors.text.primary} />
        </View>
        <Text className="text-sm font-semibold text-text-primary mb-1 font-sans">{title}</Text>
        <Text className="text-xs text-text-secondary leading-4 font-sans" numberOfLines={2}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
