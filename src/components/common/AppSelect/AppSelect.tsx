import BookingModal from "@/components/booking/BookingModal";
import { colors } from "@/theme/tokens";
import { Text, Pressable, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

type SelectItem = {
  label: string;
  value: string;
};

type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  items?: SelectItem[];
  placeholder?: string;
  disabled?: boolean;
};

export default function AppSelect({
  label,
  value,
  onChange,
  items = [],
  placeholder = "Select…",
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const selectedItem = items.find((i) => i.value === value);

  return (
    <View>
      {label ? (
        <Text className="text-xs font-medium text-text-secondary mb-1.5">{label}</Text>
      ) : null}

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        className="border border-border rounded-lg px-3 py-3 bg-surface flex-row items-center justify-between"
        style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
      >
        <Text className={selectedItem ? "text-text-primary" : "text-text-muted"}>
          {selectedItem?.label || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={16} color={colors.text.muted} />
      </Pressable>

      <BookingModal visible={open} onClose={() => setOpen(false)}>
        <Text className="text-h2 text-text-primary mb-4">{label || "Select"}</Text>

        {items.map((item) => {
          const isSelected = item.value === value;
          return (
            <Pressable
              key={item.value}
              onPress={() => {
                onChange(item.value);
                setOpen(false);
              }}
              className={`flex-row items-center justify-between px-3 py-3 rounded-lg mb-1 ${
                isSelected ? "bg-surfaceMuted" : ""
              }`}
            >
              <Text
                className={
                  isSelected ? "text-text-primary font-medium" : "text-text-secondary"
                }
              >
                {item.label}
              </Text>
              {isSelected ? (
                <Ionicons name="checkmark" size={18} color={colors.accent} />
              ) : null}
            </Pressable>
          );
        })}
      </BookingModal>
    </View>
  );
}
