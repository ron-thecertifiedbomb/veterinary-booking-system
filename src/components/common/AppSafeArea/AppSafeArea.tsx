import { ReactNode } from "react";
import {
    View,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
    children: ReactNode;
    scroll?: boolean; // ✅ enable scrolling
    center?: boolean; // ✅ center content
    padded?: boolean; // ✅ default padding
};

export default function AppSafeArea({
    children,
    scroll = false,
    center = false,
    padded = true,
}: Props) {
    const content = (
        <View
            className={`flex-1 ${padded ? "px-4" : ""
                } ${center ? "justify-center items-center" : ""}`}
        >
            {children}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                className="flex-1"
            >
                {scroll ? (
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {content}
                    </ScrollView>
                ) : (
                    content
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
``