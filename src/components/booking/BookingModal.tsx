import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { useState } from "react";

type Props = {
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: {
        ownerName: string;
        petName: string;
        serviceType: string;
    }) => void;
};

export default function BookingModal({
    visible,
    onClose,
    onSubmit,
}: Props) {
    const [ownerName, setOwnerName] = useState("");
    const [petName, setPetName] = useState("");
    const [serviceType, setServiceType] = useState("");

    return (
        <Modal visible={visible} transparent animationType="fade">

            {/* ✅ BACKDROP */}
            <View className="flex-1 bg-black/30 justify-center items-center px-4">

                {/* ✅ MODAL CARD */}
                <View className="bg-surface border border-border rounded-xl p-6 w-full max-w-md">

                    {/* ✅ TITLE */}
                    <Text className="text-text-primary font-semibold text-lg mb-4">
                        Complete Booking
                    </Text>

                    {/* ✅ INPUTS */}
                    <TextInput
                        placeholder="Owner Name"
                        value={ownerName}
                        onChangeText={setOwnerName}
                        className="border border-border rounded-lg px-4 py-3 mb-3"
                    />

                    <TextInput
                        placeholder="Pet Name"
                        value={petName}
                        onChangeText={setPetName}
                        className="border border-border rounded-lg px-4 py-3 mb-3"
                    />

                    <TextInput
                        placeholder="Service Type"
                        value={serviceType}
                        onChangeText={setServiceType}
                        className="border border-border rounded-lg px-4 py-3 mb-4"
                    />

                    {/* ✅ BUTTON ROW */}
                    <View className="flex-row gap-3">

                        {/* ✅ CANCEL */}
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 border border-border rounded-lg py-3"
                        >
                            <Text className="text-center text-text-secondary font-medium">
                                Cancel
                            </Text>
                        </TouchableOpacity>

                        {/* ✅ CONFIRM */}
                        <TouchableOpacity
                            onPress={() => {
                                onSubmit({ ownerName, petName, serviceType });

                                // ✅ reset fields
                                setOwnerName("");
                                setPetName("");
                                setServiceType("");

                                onClose();
                            }}
                            className="flex-1 bg-surfaceSoft border border-border rounded-lg py-3"
                        >
                            <Text className="text-center text-text-primary font-medium">
                                Confirm
                            </Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        </Modal>
    );
}
