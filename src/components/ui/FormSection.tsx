import SectionLabel from "@/components/ui/SectionLabel";
import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  title: string;
  children: ReactNode;
};

export default function FormSection({ title, children }: Props) {
  return (
    <View className="gap-4">
      <SectionLabel className="uppercase tracking-wide text-[11px]">{title}</SectionLabel>
      <View className="gap-4">{children}</View>
    </View>
  );
}
