import ScreenContainer from "@/components/common/layout/ScreenContainer";
import AddPetForm from "@/components/common/Pets/AddPetForm";
import { useAddPet } from "@/features/pet/hooks/useAddPet";
import { CreatePetPayload } from "@/features/pet/types";


import { showAlert } from "@/hooks/crossPlatformAlert";
import { useRouter } from "expo-router";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

export default function AddPetScreen() {
    const router = useRouter();
    const { addPet, loading } = useAddPet();


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
        <ScreenContainer>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <AddPetForm loading={loading} onSubmit={handleCreatePet} />
                </ScrollView>
            </KeyboardAvoidingView>
        </ScreenContainer>
    );
}