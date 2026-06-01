import { ActivityIndicator, View, StyleSheet } from "react-native";

type LoaderProps = {
    size?: "small" | "large";
    color?: string;
    fullScreen?: boolean;
    transparent?: boolean; // ✅ NEW
};

export default function Loader({
    size = "large",
    color = "#6b7280",
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
            className={!transparent && fullScreen ? "bg-background" : ""}
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
        backgroundColor: "rgba(0,0,0,0.3)", // ✅ dimmed transparent bg
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },
});
