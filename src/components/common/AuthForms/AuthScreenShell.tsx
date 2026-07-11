import AnimatedSlide from "@/components/common/AnimatedSlide/AnimatedSlide";
import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AUTH_MAX_WIDTH = 400;

type Props = {
  children: ReactNode;
  maxWidth?: number;
};

export default function AuthScreenShell({ children, maxWidth = AUTH_MAX_WIDTH }: Props) {
  const isWeb = Platform.OS === "web";

  const content = (
    <AnimatedSlide>
      <View
        style={{
          width: "100%",
          maxWidth,
          alignSelf: "center",
        }}
      >
        {children}
      </View>
    </AnimatedSlide>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-canvas w-full"
      style={isWeb ? { minHeight: "100vh" } : undefined}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 w-full"
        style={isWeb ? { minHeight: "100vh" } : undefined}
      >
        <ScrollView
          className="flex-1 w-full"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 24,
            paddingVertical: isWeb ? 40 : 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
