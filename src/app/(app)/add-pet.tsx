
import ScreenContainer from "@/components/common/Layouts/ScreenContainer/ScreenContainer";
import AddPetForm from "@/components/common/Pets/AddPetForm";
import { useAddPet } from "@/features/pet/hooks/useAddPet";
import { CreatePetPayload } from "@/features/pet/types";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function AddPetScreen() {
    const router = useRouter();
    const { addPet, loading } = useAddPet();
    const x = useSharedValue(300);

    useEffect(() => {
        x.value = withTiming(0, {
            duration: 350,
            easing: Easing.out(Easing.ease),
        });
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: x.value }],
    }));


    const handleCreatePet = async (data: CreatePetPayload) => {
        if (!data) {
            return;
        }
        const response = await addPet({
            petName: data.petName,
            species: data.species,
            breed: data.breed,
            weight: Number(data.weight),
        });

        // ✅ if hook handles errors → just guard
        if (!response) return;

        showAlert("Success", response.message, () => {
            router.replace(Platform.OS === "web" ? "/(web)/web-pets" : "/(app)/pets");
        });
    };

    return (
        <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                    <AddPetForm loading={loading} onSubmit={handleCreatePet} />
        </Animated.View>
    );
}