import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { View } from "react-native";
import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  const { isCompact } = useIsCompactScreen();

  const padding = isCompact
    ? "px-5 pt-5 pb-4"
    : "px-5 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10";

  return (
    <View className={`bg-canvas flex-1 ${padding} ${className}`}>{children}</View>
  );
}
