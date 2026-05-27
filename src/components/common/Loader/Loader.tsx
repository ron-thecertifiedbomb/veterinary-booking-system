// components/ui/Loader.tsx

import { ActivityIndicator, View } from "react-native";

type LoaderProps = {
    size?: "small" | "large";
    color?: string;
    fullScreen?: boolean;
};

export default function Loader({
    size = "large",
    color = "#6b7280",
    fullScreen = true,
}: LoaderProps) {
    return (
        <View
            style={{
                flex: fullScreen ? 1 : undefined,
                justifyContent: "center",
                alignItems: "center",
                padding: fullScreen ? 0 : 16,
            }}
            className={fullScreen ? "bg-background" : ""}
        >
            <ActivityIndicator size={size} color={color} />
        </View>
    );
}
``