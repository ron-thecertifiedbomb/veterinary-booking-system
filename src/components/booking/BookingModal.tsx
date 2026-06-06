import {
    Modal,
    View,
    TouchableOpacity,
    ScrollView,
    useWindowDimensions,
} from "react-native";

export default function BookingModal({
    visible,
    onClose,
    children,
}: any) {
    const { width } = useWindowDimensions();

    // ✅ breakpoint (you can adjust)
    const isLargeScreen = width >= 768; // tablet / web

    return (
        <Modal
            visible={visible}
            animationType={isLargeScreen ? "fade" : "slide"}
            transparent
        >
            {/* ✅ BACKDROP */}
            <View
                className={`flex-1 bg-black/40 ${isLargeScreen
                        ? "justify-center items-center"
                        : "justify-end"
                    }`}
            >
                {/* ✅ TAP OUTSIDE */}
                <TouchableOpacity
                    className={`${isLargeScreen ? "absolute inset-0" : "flex-1"
                        }`}
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* ✅ MODAL CARD */}
                <View
                    className={`bg-white ${isLargeScreen
                            ? "w-full max-w-md rounded-2xl p-6"
                            : "rounded-t-3xl px-4 pt-4 pb-6 max-h-[85%]"
                        }`}
                >
                    {/* ✅ HANDLE (mobile only) */}
                    {!isLargeScreen && (
                        <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />
                    )}

                    {/* ✅ CONTENT */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 24,
                        }}
                    >
                        {children}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}