import { useEffect } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    Easing,
} from "react-native-reanimated";

import UpdateProfileForm from "@/components/common/Profile/UpdateProfileForm";

export default function UpdateProfileFormScreen() {
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
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
            <UpdateProfileForm />
        </Animated.View>
    );
}
``