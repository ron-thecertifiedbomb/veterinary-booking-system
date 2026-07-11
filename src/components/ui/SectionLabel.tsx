import { Text } from "react-native";

type Props = {
  children: string;
  className?: string;
};

export default function SectionLabel({ children, className = "" }: Props) {
  return (
    <Text className={`text-xs font-medium text-text-muted ${className}`}>{children}</Text>
  );
}
