import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ServerTimeBannerProps {
  serverTime?: string | null;
  loading?: boolean;
}

export const ServerTimeBanner: React.FC<ServerTimeBannerProps> = ({
  serverTime,
  loading,
}) => {
  const displayTime = serverTime || "Syncing…";

  return (
    <View className="w-full px-3 py-2.5 bg-surface border border-border rounded-lg mb-4 flex-row items-center justify-between">
      <View className="flex-row items-center flex-1 gap-2.5">
        <View
          className={`h-2 w-2 rounded-full ${loading ? "bg-warning" : "bg-success"}`}
        />
        <View className="flex-1">
          <Text className="text-xs text-text-muted">Server time</Text>
          <Text className="text-sm text-text-primary mt-0.5" numberOfLines={1}>
            {displayTime}
          </Text>
        </View>
      </View>

      <View className="p-1.5 rounded-md bg-surfaceMuted">
        <Ionicons name="time-outline" size={14} color="#71717A" />
      </View>
    </View>
  );
};
