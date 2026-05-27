import { Modal, View, Text, Pressable } from "react-native";

type Props = {
    visible: boolean;
    type?: "success" | "error";
    title?: string;
    message?: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
};

export default function AppModal({
    visible,
    type = "success",
    title,
    message,
    onClose,
    onConfirm,
    confirmText = "Continue",
}: Props) {
    const isSuccess = type === "success";

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/40 px-6">

                <View className="bg-white rounded-2xl p-6 w-full max-w-sm items-center">

                    {/* ✅ Icon */}
                    <Text className="text-4xl mb-3">
                        {isSuccess ? "✅" : "❌"}
                    </Text>

                    {/* ✅ Title */}
                    <Text className="text-lg font-semibold text-text-primary mb-2">
                        {title || (isSuccess ? "Success" : "Error")}
                    </Text>

                    {/* ✅ Message */}
                    <Text className="text-sm text-text-secondary text-center mb-5">
                        {message || (isSuccess
                            ? "Operation completed successfully."
                            : "Something went wrong.")}
                    </Text>

                    {/* ✅ Buttons */}
                    <View className="flex-row gap-3">

                        <Pressable
                            onPress={onClose}
                            className="px-5 py-3 rounded-xl bg-gray-200 active:opacity-80"
                        >
                            <Text className="text-sm font-medium text-gray-800">
                                Close
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={onConfirm || onClose}
                            className={`px-5 py-3 rounded-xl ${isSuccess ? "bg-black" : "bg-red-500"
                                } active:opacity-80`}
                        >
                            <Text className="text-white text-sm font-semibold">
                                {confirmText}
                            </Text>
                        </Pressable>

                    </View>

                </View>

            </View>
        </Modal>
    );
}
