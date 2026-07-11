import { colors } from "@/theme/tokens";
import { ActivityIndicator, View, StyleSheet } from "react-native";

type LoaderProps = {
    size?: "small" | "large";
    color?: string;
    fullScreen?: boolean;
    transparent?: boolean;
};

export default function Loader({
    size = "large",
    color = colors.text.muted,
    fullScreen = true,
    transparent = false,
}: LoaderProps) {
    return (
        <View
            style={[
                styles.container,
                fullScreen && styles.fullScreen,
                transparent && styles.transparentOverlay,
            ]}
            className={!transparent && fullScreen ? "bg-canvas" : ""}
        >
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    fullScreen: {
        flex: 1,
    },
    transparentOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(24,24,27,0.2)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
});
