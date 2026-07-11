import { ReactNode } from "react";
import { Pressable, View } from "react-native";

type Props = {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
};

export default function AppCard({ children, onPress, className = "" }: Props) {
  const content = (
    <View
      className={`bg-surface border border-border rounded-xl p-4 ${className}`}
    >
      {children}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.92 : 1 })}
    >
      {content}
    </Pressable>
  );
}
