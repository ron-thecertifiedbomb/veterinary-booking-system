import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { layout, spacing } from "@/theme/tokens";

export function useMobileInsets(withTabBar = false) {
  const insets = useSafeAreaInsets();
  const isNative = Platform.OS !== "web";

  const tabBarOffset = withTabBar
    ? (Platform.OS === "ios" ? layout.tabBarHeightIos : layout.tabBarHeightAndroid) +
      insets.bottom
    : insets.bottom;

  const screenPadding = {
    paddingBottom: isNative ? Math.max(tabBarOffset, spacing.lg) + spacing.lg : spacing["3xl"],
  };

  return { insets, isNative, tabBarOffset, screenPadding };
}
