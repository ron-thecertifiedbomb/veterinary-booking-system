import SectionLabel from "@/components/ui/SectionLabel";
import StatusBadge from "@/components/ui/StatusBadge";
import { Text, View } from "react-native";

type Props = {
  name: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  meta?: { label: string; value: string }[];
};

function initials(name: string) {
  return (
    name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export default function UserListCard({
  name,
  subtitle,
  email,
  phone,
  isActive = true,
  meta = [],
}: Props) {
  return (
    <View className="bg-surface border border-border rounded-xl p-4 mb-3">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-row items-center flex-1 gap-3">
          <View className="w-10 h-10 rounded-lg bg-surfaceMuted border border-border items-center justify-center">
            <Text className="text-sm font-semibold text-text-secondary">
              {initials(name)}
            </Text>
          </View>

          <View className="flex-1">
            <Text className="text-body font-medium text-text-primary" numberOfLines={1}>
              {name}
            </Text>
            {subtitle ? (
              <Text className="text-sm text-text-secondary mt-0.5" numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        <StatusBadge
          label={isActive ? "Active" : "Inactive"}
          variant={isActive ? "success" : "muted"}
        />
      </View>

      {(email || phone || meta.length > 0) && (
        <View className="mt-4 pt-3 border-t border-border gap-2">
          {email ? (
            <View>
              <SectionLabel>Email</SectionLabel>
              <Text className="text-sm text-text-primary mt-1">{email}</Text>
            </View>
          ) : null}
          {phone ? (
            <View>
              <SectionLabel>Phone</SectionLabel>
              <Text className="text-sm text-text-primary mt-1">{phone}</Text>
            </View>
          ) : null}
          {meta.map((row) => (
            <View key={row.label}>
              <SectionLabel>{row.label}</SectionLabel>
              <Text className="text-sm text-text-primary mt-1">{row.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
