import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { ReactNode } from "react";
import { Text, View } from "react-native";
import { colors, layout } from "@/theme/tokens";

type Props = {
  children: ReactNode;
  title?: string;
  lead?: string;
  className?: string;
  wide?: boolean;
};

export default function Panel({ children, title, lead, className = "", wide }: Props) {
  const { isCompact } = useIsCompactScreen();

  return (
    <View
      className={`bg-surface border border-border rounded-xl overflow-hidden shadow-sm ${
        wide ? "max-w-4xl w-full" : "max-w-2xl w-full"
      } ${className}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      <View style={{ height: layout.clinicalStripe, backgroundColor: colors.clinical }} />
      <View className={isCompact ? "px-5 py-5" : "px-6 py-6 lg:px-8 lg:py-7"}>
        {title ? (
          <Text className="text-h2 text-text-primary font-semibold font-sans">{title}</Text>
        ) : null}
        {lead ? (
          <Text className="text-sm text-text-secondary mt-2 mb-5 leading-5 font-sans">{lead}</Text>
        ) : title ? (
          <View className="mb-4" />
        ) : null}
        {children}
      </View>
    </View>
  );
}
