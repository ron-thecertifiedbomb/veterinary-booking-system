import { Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/tokens";
import { useMobileInsets } from "@/hooks/useMobileInsets";

type Props = {
  label: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  withTabBar?: boolean;
};

export default function Fab({
  label,
  onPress,
  icon = "add",
  withTabBar = true,
}: Props) {
  const { tabBarOffset, isNative } = useMobileInsets(withTabBar);

  const bottom = isNative ? tabBarOffset + 12 : 24;

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      className={`absolute right-5 flex-row items-center gap-2.5 bg-accent rounded-full pl-4 pr-5 py-3.5 border border-accent ${
        isNative ? "shadow-lg" : ""
      }`}
      style={({ pressed }) => ({
        bottom,
        opacity: pressed ? 0.92 : 1,
        backgroundColor: pressed ? colors.sidebarHover : colors.accent,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isNative ? 0.18 : 0.12,
        shadowRadius: isNative ? 10 : 6,
        elevation: 6,
      })}
    >
      <View className="w-7 h-7 rounded-full bg-white/15 items-center justify-center">
        <Ionicons name={icon} size={18} color="#ffffff" />
      </View>
      <Text className="text-sm font-semibold text-text-inverse font-sans">{label}</Text>
    </Pressable>
  );
}
