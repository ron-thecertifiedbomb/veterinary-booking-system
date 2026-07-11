import SectionLabel from "@/components/ui/SectionLabel";
import AppButton from "@/components/ui/AppButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { UserRole } from "@/features/auth/types/auth.user";
import { userProfile } from "@/features/users/types/types";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { colors, iconSize } from "@/theme/tokens";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface ProfileCardProps {
  profile: userProfile | null;
  onEditPress: () => void;
}

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrator",
  STAFF: "Staff",
  CUSTOMER: "Pet owner",
};

function initials(name: string) {
  return (
    name
      ?.split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function DetailRow({
  icon,
  label,
  value,
  valueClassName = "text-text-primary",
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <View className="flex-row items-center gap-3 bg-surfaceMuted/60 border border-border rounded-xl px-4 py-3.5">
      <View className="w-9 h-9 rounded-lg bg-surface items-center justify-center">
        <Ionicons name={icon} size={iconSize.md} color={colors.text.muted} />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-xs font-medium text-text-muted font-sans">{label}</Text>
        <Text className={`text-sm font-medium mt-0.5 font-sans ${valueClassName}`} numberOfLines={1}>
          {value}
        </Text>
      </View>
    </View>
  );
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEditPress }) => {
  const { isCompact, isNarrow } = useIsCompactScreen();
  const name = profile?.name?.trim() || "User";
  const email = profile?.email || "—";
  const phone = profile?.phone || "—";
  const role: UserRole = profile?.role || "CUSTOMER";
  const isActive = profile?.isActive ?? false;
  const petCount = profile?.customerProfile?.pets?.length ?? profile?.customerProfile?.totalPets ?? 0;
  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  if (isCompact) {
    return (
      <View>
        <View className={`items-center ${isNarrow ? "mb-6" : "mb-7"}`}>
          <View
            className={`${isNarrow ? "w-16 h-16" : "w-[72px] h-[72px]"} rounded-2xl bg-accent items-center justify-center mb-4`}
          >
            <Text className="text-xl font-bold text-text-inverse font-sans">{initials(name)}</Text>
          </View>
          <Text className="text-2xl text-text-primary font-bold text-center font-sans" numberOfLines={2}>
            {name}
          </Text>
          <Text className="text-sm text-text-secondary mt-1.5 text-center font-sans px-2" numberOfLines={1}>
            {email}
          </Text>
          <View className="mt-3">
            <StatusBadge label={roleLabels[role]} variant="default" />
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2 mb-6">
          <View className="px-3.5 py-2.5 rounded-lg bg-surfaceMuted border border-border">
            <Text className="text-xs font-medium text-text-secondary font-sans">
              {isActive ? "Active account" : "Inactive account"}
            </Text>
          </View>
          {role === "CUSTOMER" ? (
            <View className="px-3.5 py-2.5 rounded-lg bg-accent">
              <Text className="text-xs font-semibold text-text-inverse font-sans">
                {petCount} {petCount === 1 ? "pet" : "pets"}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-3 mb-6">
          <DetailRow icon="call-outline" label="Phone" value={phone} />
          <DetailRow
            icon={isActive ? "checkmark-circle-outline" : "close-circle-outline"}
            label="Account status"
            value={isActive ? "Active" : "Inactive"}
            valueClassName={isActive ? "text-success" : "text-danger"}
          />
          <DetailRow icon="calendar-outline" label="Member since" value={memberSince} />
        </View>

        <AppButton label="Edit profile" onPress={onEditPress} variant="secondary" />
      </View>
    );
  }

  return (
    <View>
      <View className="flex-row items-center gap-4 mb-6 pb-6 border-b border-border">
        <View className="w-14 h-14 rounded-xl bg-accent items-center justify-center">
          <Text className="text-lg font-bold text-text-inverse font-sans">{initials(name)}</Text>
        </View>
        <View className="flex-1 min-w-0">
          <Text className="text-pageTitle text-text-primary font-bold font-sans" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-sm text-text-secondary mt-1 font-sans" numberOfLines={1}>
            {email}
          </Text>
        </View>
        <StatusBadge label={roleLabels[role]} variant="default" />
      </View>

      <View className="flex-row flex-wrap gap-2 mb-6">
        <View className="px-3.5 py-2 rounded-lg bg-surfaceMuted border border-border">
          <Text className="text-xs font-medium text-text-secondary font-sans">
            {isActive ? "Active account" : "Inactive account"}
          </Text>
        </View>
        {role === "CUSTOMER" ? (
          <View className="px-3.5 py-2 rounded-lg bg-accent">
            <Text className="text-xs font-semibold text-text-inverse font-sans">
              {petCount} {petCount === 1 ? "pet" : "pets"}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="gap-5 mb-6">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <SectionLabel>Phone</SectionLabel>
            <Text className="text-body text-text-primary mt-1 font-sans">{phone}</Text>
          </View>
          <View className="flex-1">
            <SectionLabel>Status</SectionLabel>
            <View className="flex-row items-center gap-1.5 mt-1">
              <Ionicons
                name={isActive ? "checkmark-circle-outline" : "close-circle-outline"}
                size={iconSize.sm}
                color={isActive ? colors.success : colors.danger}
              />
              <Text
                className={`text-body font-medium font-sans ${
                  isActive ? "text-success" : "text-danger"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <SectionLabel>Member since</SectionLabel>
          <Text className="text-body text-text-primary mt-1 font-sans">{memberSince}</Text>
        </View>
      </View>

      <AppButton label="Edit profile" onPress={onEditPress} variant="secondary" />
    </View>
  );
};
