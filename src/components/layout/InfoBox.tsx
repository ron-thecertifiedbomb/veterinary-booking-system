import { Text, View } from "react-native";

type Props = {
  title: string;
  items: string[];
};

export default function InfoBox({ title, items }: Props) {
  return (
    <View className="bg-surfaceMuted border border-border rounded-xl p-5 mt-8">
      <Text className="text-sm font-semibold text-text-primary mb-3 font-sans">{title}</Text>
      {items.map((item) => (
        <Text key={item} className="text-sm text-text-secondary leading-6 font-sans">
          · {item}
        </Text>
      ))}
    </View>
  );
}
