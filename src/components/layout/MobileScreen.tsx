import { useMobileInsets } from "@/hooks/useMobileInsets";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";

type Props = {
  children: ReactNode;
  scroll?: boolean;
  withTabBar?: boolean;
};

export default function MobileScreen({
  children,
  scroll = true,
  withTabBar = false,
}: Props) {
  const { screenPadding, isNative } = useMobileInsets(withTabBar);

  if (!isNative) {
    return <>{children}</>;
  }

  if (!scroll) {
    return <View className="flex-1">{children}</View>;
  }

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        flexGrow: 1,
        ...screenPadding,
      }}
    >
      {children}
    </ScrollView>
  );
}
