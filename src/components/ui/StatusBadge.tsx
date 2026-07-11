import { Text, View } from "react-native";

type Variant = "default" | "success" | "warning" | "danger" | "muted" | "draft" | "sent" | "paid";

type Props = {
  label: string;
  variant?: Variant;
};

const styles: Record<Variant, string> = {
  default: "bg-surfaceMuted border-border text-text-secondary",
  muted: "bg-surfaceMuted border-border text-text-muted",
  draft: "bg-canvas border-border text-text-secondary",
  sent: "bg-warningBg border-amber-200 text-warning",
  paid: "bg-successBg border-green-200 text-success",
  success: "bg-successBg border-green-200 text-success",
  warning: "bg-warningBg border-amber-200 text-warning",
  danger: "bg-dangerBg border-red-200 text-danger",
};

export default function StatusBadge({ label, variant = "default" }: Props) {
  const display = label.charAt(0) + label.slice(1).toLowerCase().replace(/_/g, " ");

  return (
    <View className={`px-2.5 py-1 rounded-md border ${styles[variant]}`}>
      <Text className="text-xs font-medium capitalize font-sans">{display}</Text>
    </View>
  );
}
