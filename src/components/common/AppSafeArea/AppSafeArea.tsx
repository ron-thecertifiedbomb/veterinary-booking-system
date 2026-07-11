import { ReactNode } from "react";
import { Platform, ScrollView, KeyboardAvoidingView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  children: ReactNode;
  scroll?: boolean;
};

/** Stack screens (no tab bar) — full safe area + optional scroll. */
export default function AppSafeArea({ children, scroll = false }: Props) {
  const content = scroll ? (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 32 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    children
  );

  return (
    <SafeAreaView className="flex-1 bg-canvas" edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        {content}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
