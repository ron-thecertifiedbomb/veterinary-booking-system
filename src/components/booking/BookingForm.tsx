import { View, Text, TextInput } from "react-native";
import { logger } from "@/utils/logger";

type Props = {
    ownerName: string;
    petName: string;
    serviceType: string;

    setOwnerName: (v: string) => void;
    setPetName: (v: string) => void;
    setServiceType: (v: string) => void;
};

export default function BookingForm({
    ownerName,
    petName,
    serviceType,
    setOwnerName,
    setPetName,
    setServiceType,
}: Props) {
    return (
        <View className="gap-3 mb-5">

            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Owner Name
                </Text>
                <TextInput
                    value={ownerName}
                    onChangeText={(v) => {
                        logger.info("Owner Name changed", v);
                        setOwnerName(v);
                    }}
                    placeholder="Juan Dela Cruz"
                    className="border border-gray-300 rounded-xl px-4 py-3"
                />
            </View>

            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Pet Name
                </Text>
                <TextInput
                    value={petName}
                    onChangeText={(v) => {
                        logger.info("Pet Name changed", v);
                        setPetName(v);
                    }}
                    placeholder="Max"
                    className="border border-gray-300 rounded-xl px-4 py-3"
                />
            </View>

            <View>
                <Text className="text-xs text-gray-500 mb-1">
                    Service Type
                </Text>
                <TextInput
                    value={serviceType}
                    onChangeText={(v) => {
                        logger.info("Service Type changed", v);
                        setServiceType(v);
                    }}
                    placeholder="Vaccination / Checkup"
                    className="border border-gray-300 rounded-xl px-4 py-3"
                />
            </View>

        </View>
    );
}