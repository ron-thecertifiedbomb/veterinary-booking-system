import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export default function AnimatedSlide({ children }: any) {
    const translateY = useRef(new Animated.Value(60)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: 0,
                friction: 7,
                tension: 80,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 350,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <Animated.View
            style={{
                transform: [{ translateY }],
                opacity,
                width: "100%",
            }}
        >
            {children}
        </Animated.View>
    );
}
