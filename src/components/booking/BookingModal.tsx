
import {
    Modal,
    View,
    TouchableOpacity,
    Text,
    ScrollView,
} from "react-native";

export default function BookingModal({
    visible,
    onClose,
    children,
}: any) {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
        >
            {/* ✅ BACKDROP */}
            <View className="flex-1 bg-black/40 justify-end">

                {/* ✅ TAP OUTSIDE TO CLOSE */}
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* ✅ MODAL CARD */}
                <View className="bg-white rounded-t-3xl px-4 pt-4 pb-6 max-h-[85%]">

                    {/* ✅ HANDLE BAR */}
                    <View className="w-12 h-1.5 bg-gray-300 rounded-full self-center mb-4" />

                    {/* ✅ SCROLLABLE CONTENT */}
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
