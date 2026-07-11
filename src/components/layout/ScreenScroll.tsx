import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { useMobileInsets } from "@/hooks/useMobileInsets";
import { ReactNode } from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";
import MobileScreen from "./MobileScreen";

type Props = {
  children: ReactNode;
  withTabBar?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function ScreenScroll({
  children,
  withTabBar = false,
  refreshing,
  onRefresh,
}: Props) {
  const { isNative } = useIsCompactScreen();
  const { screenPadding } = useMobileInsets(withTabBar);

  const refreshControl =
    onRefresh != null ? (
      <RefreshControl refreshing={Boolean(refreshing)} onRefresh={onRefresh} />
    ) : undefined;

  const scroll = (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: withTabBar && isNative ? screenPadding.paddingBottom : 32,
      }}
    >
      {children}
    </ScrollView>
  );

  if (isNative && withTabBar) {
    return <MobileScreen withTabBar scroll={false}>{scroll}</MobileScreen>;
  }

  return scroll;
}
