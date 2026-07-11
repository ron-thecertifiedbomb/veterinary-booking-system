import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title?: string;
  lead?: string;
  children: ReactNode;
  className?: string;
  compact?: boolean;
  embedded?: boolean;
};

export default function FormCard({
  title,
  lead,
  children,
  className = "",
  compact = false,
  embedded = false,
}: Props) {
  const { isCompact } = useIsCompactScreen();

  const surfacePadding = embedded
    ? isCompact
      ? "px-1 py-1"
      : "px-2 py-2"
    : compact
      ? isCompact
        ? "px-5 py-5"
        : "px-5 py-5"
      : isCompact
        ? "px-5 py-6"
        : "px-6 py-7 sm:px-8 sm:py-8";

  return (
    <View
      className={`w-full ${
        embedded ? surfacePadding : `bg-surface border border-border rounded-xl ${surfacePadding}`
      } ${className}`}
    >
      {title ? (
        <View className={compact || isCompact ? "mb-5" : "mb-7"}>
          <Text className="text-h2 text-text-primary font-semibold font-sans">{title}</Text>
          {lead ? (
            <Text className="text-sm text-text-secondary mt-1.5 leading-5 font-sans">{lead}</Text>
          ) : null}
        </View>
      ) : null}
      {children}
    </View>
  );
}
