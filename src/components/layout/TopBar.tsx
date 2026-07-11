import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

export default function TopBar({ title, description, actions }: Props) {
  const { isCompact, isNarrow } = useIsCompactScreen();

  if (isCompact) {
    return (
      <View className="bg-surface border-b border-border px-4 py-4 gap-3">
        <View className="flex-1 min-w-0">
          <Text
            className={`${isNarrow ? "text-xl" : "text-2xl"} text-text-primary font-bold font-sans`}
          >
            {title}
          </Text>
          {description ? (
            <Text className="text-sm text-text-secondary mt-1.5 leading-5 font-sans">
              {description}
            </Text>
          ) : null}
        </View>
        {actions ? (
          <View className={`flex-row flex-wrap gap-2 ${isNarrow ? "w-full" : ""}`}>
            {actions}
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View className="bg-surface border-b border-border px-6 py-5 flex-row items-center justify-between gap-4">
      <View className="flex-1">
        <Text className="text-pageTitle text-text-primary font-bold font-sans">{title}</Text>
        {description ? (
          <Text className="text-sm text-text-secondary mt-1.5 font-sans">{description}</Text>
        ) : null}
      </View>
      {actions ? <View className="flex-row gap-2 items-center">{actions}</View> : null}
    </View>
  );
}
