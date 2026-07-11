import Loader from "@/components/common/Loader/Loader";
import { Redirect, Slot } from "expo-router";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  role?: "ADMIN" | "STAFF" | "CUSTOMER";
  fallback?: string;
};

export default function ProtectedLayout({
  role,
  fallback = "/(auth)/login",
}: Props) {
  const { user, loading, isAuthenticated } = useAuth();
  const isNative = Platform.OS !== "web";

  if (loading) return <Loader fullScreen={false} size="small" />;

  if (!isAuthenticated) {
    return <Redirect href={fallback} />;
  }

  if (role && user?.role !== role) {
    return <Redirect href={fallback} />;
  }

  if (isNative) {
    return (
      <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right"]}>
        <Slot />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-canvas">
      <Slot />
    </View>
  );
}
