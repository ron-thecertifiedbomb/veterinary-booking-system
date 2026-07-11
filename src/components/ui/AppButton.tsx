import { ActivityIndicator, Pressable, Text } from "react-native";
import { colors } from "@/theme/tokens";

type Variant = "primary" | "secondary" | "outline" | "danger" | "ghost";

type Props = {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: Variant;
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "md";
};

const variantStyles: Record<Variant, { container: string; text: string }> = {
  primary: {
    container: "bg-accent border border-accent",
    text: "text-text-inverse font-semibold",
  },
  secondary: {
    container: "bg-surfaceMuted border border-border",
    text: "text-text-primary font-medium",
  },
  outline: {
    container: "bg-surface border border-borderStrong",
    text: "text-text-primary font-medium",
  },
  danger: {
    container: "bg-danger border border-danger",
    text: "text-text-inverse font-semibold",
  },
  ghost: {
    container: "bg-transparent border border-transparent",
    text: "text-text-secondary font-medium",
  },
};

export default function AppButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = "primary",
  className = "",
  fullWidth = true,
  size = "md",
}: Props) {
  const styles = variantStyles[variant];
  const isDisabled = disabled || loading;
  const padding = size === "sm" ? "py-2.5 px-4" : "py-3.5 px-5";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={`rounded-lg items-center justify-center ${padding} ${
        fullWidth ? "w-full" : ""
      } ${styles.container} ${isDisabled ? "opacity-45" : ""} ${className}`}
      style={({ pressed }) => ({
        opacity: isDisabled ? 0.45 : pressed ? 0.9 : 1,
        backgroundColor:
          pressed && variant === "primary" && !isDisabled ? colors.sidebarHover : undefined,
      })}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" || variant === "danger" ? "#fff" : colors.accent}
        />
      ) : (
        <Text className={`${size === "sm" ? "text-sm" : "text-body"} ${styles.text}`}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}
