import { iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import { Platform, Text, View } from "react-native";

type Props = {
  title: string;
  subtitle: string;
};

export default function AuthBranding({ title, subtitle }: Props) {
  const isNative = Platform.OS !== "web";

  return (
    <View className={`w-full items-center ${isNative ? "mb-8 px-1" : "mb-10"}`}>
      <View className="w-12 h-12 rounded-xl items-center justify-center mb-5 bg-accent">
        <Ionicons name="medical-outline" size={iconSize.xl} color="#fff" />
      </View>
      <Text className="text-pageTitle text-text-primary font-bold text-center font-sans">
        {title}
      </Text>
      <Text className="text-sm text-text-secondary mt-2 text-center leading-5 font-sans max-w-[320px] px-2">
        {subtitle}
      </Text>
    </View>
  );
}
