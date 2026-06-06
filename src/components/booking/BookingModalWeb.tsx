import {
    Modal,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";

export default function BookingModalWeb({
    visible,
    onClose,
    children,
}: any) {
    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent
        >
            {/* ✅ BACKDROP */}
            <View className="flex-1 bg-black/40 justify-center items-center">

                {/* CLICK OUTSIDE */}
                <TouchableOpacity
                    className="absolute inset-0"
                    activeOpacity={1}
                    onPress={onClose}
                />

                {/* CENTER MODAL */}
                <View className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        {children}
                    </ScrollView>

                </View>
            </View>
        </Modal>
    );
}