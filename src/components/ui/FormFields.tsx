import { ReactNode } from "react";
import { View } from "react-native";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function FormFields({ children, className = "" }: Props) {
  return <View className={`gap-5 ${className}`}>{children}</View>;
}
