import Container from "@/components/common/Container/Container";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { formatBookingCode } from "@/utils/dateandtime/formatter";
import { logger } from "@/utils/logger/logger";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function AppoinmentSuccess() {

    const router = useRouter();

    const { appointments } = useAuth();

    logger.info('appointment from storage on AppoinmentSuccess', appointments)

    return (
        <Container>
            {!appointments && <Loader fullScreen />}
            <View className="w-full max-w-md mx-auto bg-surface border border-border rounded-2xl p-6">

                <Text className="text-2xl font-semibold text-text-primary text-center">
                    Appointment Summar
                </Text>

                <Text className="text-sm text-text-muted text-center mt-2 mb-6">
                    Your appointment request has been submitted successfully.
                </Text>

                <View className="bg-background rounded-xl p-4 mb-6">
                    <Text className="text-xs text-text-muted uppercase mb-2">
                        Booking Details
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        Booking Code: {formatBookingCode(appointments?.bookingCode)}
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        Pet: {appointments?.petId}
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        Service: {appointments?.serviceType}
                    </Text>

                    <Text className="text-sm text-text-secondary mb-1">
                        {appointments?.appointmentDate}
                    </Text>

                </View>

                <TouchableOpacity
                    onPress={() => router.replace("/home")}
                    className="bg-black rounded-xl py-3"
                >
                    <Text className="text-white text-center font-medium">
                        Book Another Appointment
                    </Text>
                </TouchableOpacity>

            </View>
        </Container>
    );
}