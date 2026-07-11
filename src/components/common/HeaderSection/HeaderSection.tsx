import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { Text, View } from "react-native";

type Props = {
  title: string;
  description?: string;
};

export default function HeaderSection({ title, description }: Props) {
  const { isCompact } = useIsCompactScreen();

  return (
    <View className={`w-full ${isCompact ? "mb-6" : "mb-8"}`}>
      <Text
        className={`${
          isCompact ? "text-2xl" : "text-pageTitle"
        } text-text-primary font-bold font-sans`}
      >
        {title}
      </Text>
      {description ? (
        <Text className="text-sm text-text-secondary mt-2 leading-5 max-w-xl font-sans">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
