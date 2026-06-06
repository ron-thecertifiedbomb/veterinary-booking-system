import { Pressable, View, ViewStyle } from "react-native";

type Props = {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
};

export default function AppPetCard({ children, onPress, style }: Props) {
    const Container = onPress ? Pressable : View;

    return (
        <Container
            onPress={onPress}
            style={({ pressed }: any) => ({
                transform: onPress
                    ? [{ scale: pressed ? 0.97 : 1 }]
                    : undefined,
            })}
        >
            <View
                style={[
                    {
                        backgroundColor: "#fff",
                        borderRadius: 16,
                        padding: 16,
                        marginBottom: 12,

                        // ✅ Cross-platform shadow
                        shadowColor: "#000",
                        shadowOpacity: 0.06,
                        shadowRadius: 10,
                        shadowOffset: { width: 0, height: 4 },
                        elevation: 2,
                    },
                    style,
                ]}
                className="border border-gray-100"
            >
                {children}
            </View>
        </Container>
    );
}