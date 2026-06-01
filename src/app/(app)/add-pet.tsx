import AddPetForm from "@/components/common/Pets/AddPetForm";
import { useEffect } from "react";

import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { Easing } from "react-native-reanimated";

export default function AddPetScreen() {
    const x = useSharedValue(300);

    useEffect(() => {
        x.value = withTiming(0, {
            duration: 350,
            easing: Easing.out(Easing.ease),
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: x.value }],
    }));

    return (
        <Animated.View
            style={[
                { flex: 1, backgroundColor: "#F9FAFB" },
                animatedStyle,
            ]}
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <AddPetForm />
                </ScrollView>
            </KeyboardAvoidingView>
        </Animated.View>
    );
}