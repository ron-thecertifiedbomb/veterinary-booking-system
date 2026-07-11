import { Pressable, Text, View } from "react-native";

type Props = {
  prompt: string;
  actionLabel: string;
  onPress?: () => void;
};

export default function FormFooterLink({ prompt, actionLabel, onPress }: Props) {
  return (
    <View className="mt-6 flex-row items-center justify-center gap-1.5">
      <Text className="text-sm text-text-secondary font-sans">{prompt}</Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text className="text-sm font-semibold text-text-primary font-sans">{actionLabel}</Text>
      </Pressable>
    </View>
  );
}
