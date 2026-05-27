import { useAddPet } from "@/features/pet/useAddPet";
import { showAlert } from "@/hooks/crossPlatformAlert";

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator, BackHandler, Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View
} from "react-native";

export default function AddPetForm() {
    const router = useRouter();
    const { addPet, loading } = useAddPet();

    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [breed, setBreed] = useState("");
    const [weight, setWeight] = useState("");

    const [nameError, setNameError] = useState<string | null>(null);
    const [speciesError, setSpeciesError] = useState<string | null>(null);



    useEffect(() => {
        const backAction = () => {
            const isWeb = Platform.OS === "web";

            router.replace(
                isWeb
                    ? "/(web)/pets"
                    : "/pets"
            );

            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, []);



    const noOutline =
        Platform.OS === "web"
            ? ({ outlineStyle: "none" } as any)
            : undefined;

    const isDisabled = !name || !species || loading;

    const handleCreatePet = async () => {
        setNameError(null);
        setSpeciesError(null);

        let hasError = false;

        if (!name) {
            setNameError("Pet name is required");
            hasError = true;
        }

        if (!species) {
            setSpeciesError("Species is required");
            hasError = true;
        }

        if (hasError) return;

        const response = await addPet({
            name,
            species,
            breed,
            weight: weight ? Number(weight) : undefined,
        });

        if (!response) {
            showAlert("Error", "Failed to create pet");
            return;
        }

        const handleSuccess = () => {
            router.replace(Platform.OS === "web" ? "/(web)/pets" : "/pets");
        };

        showAlert("Success", response.message, handleSuccess);
    };

    return (
        <ScrollView
            className="flex-1 bg-background"
            contentContainerClassName="items-center px-6 pb-10"
            keyboardShouldPersistTaps="handled"
        >

            <View className="w-full max-w-xl pt-6 lg:p-14">

                {/* ✅ HEADER */}
                <View className="mb-8 items-center">
                    <Text className="text-3xl font-semibold text-text-primary">
                        Add a Pet
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1 text-center">
                        Enter your pet’s details for booking appointments.
                    </Text>
                </View>

                <View className="gap-4">

                    {/* ✅ PET NAME */}
                    <View>
                        <Text className="text-sm font-medium mb-2">
                            Pet Name
                        </Text>
                        <TextInput
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                setNameError(null);
                            }}
                            placeholder="e.g. Duff"
                            className={`bg-surface border ${nameError ? "border-red-500" : "border-gray-300"
                                } rounded-2xl px-4 py-4 text-text-primary`}
                            style={noOutline}
                        />
                        {nameError && (
                            <Text className="text-red-500 text-xs mt-2">
                                {nameError}
                            </Text>
                        )}
                    </View>

                    {/* ✅ SPECIES */}
                    <View>
                        <Text className="text-sm font-medium mb-2">
                            Species
                        </Text>
                        <TextInput
                            value={species}
                            onChangeText={(text) => {
                                setSpecies(text);
                                setSpeciesError(null);
                            }}
                            placeholder="Dog, Cat, etc."
                            className={`bg-surface border ${speciesError ? "border-red-500" : "border-gray-300"
                                } rounded-2xl px-4 py-4 text-text-primary`}
                            style={noOutline}
                        />
                        {speciesError && (
                            <Text className="text-red-500 text-xs mt-2">
                                {speciesError}
                            </Text>
                        )}
                    </View>

                    {/* ✅ BREED */}
                    <View>
                        <Text className="text-sm font-medium mb-2">
                            Breed (optional)
                        </Text>
                        <TextInput
                            value={breed}
                            onChangeText={setBreed}
                            placeholder="e.g. Labrador"
                            className="bg-surface border border-gray-300 rounded-2xl px-4 py-4 text-text-primary"
                            style={noOutline}
                        />
                    </View>

                    {/* ✅ WEIGHT */}
                    <View>
                        <Text className="text-sm font-medium mb-2">
                            Weight (kg)
                        </Text>
                        <TextInput
                            value={weight}
                            onChangeText={(text) => {
                                const numeric = text.replace(/[^0-9.]/g, "");
                                setWeight(numeric);
                            }}
                            placeholder="e.g. 12.5"
                            keyboardType="numeric"
                            className="bg-surface border border-gray-300 rounded-2xl px-4 py-4 text-text-primary"
                            style={noOutline}
                        />
                    </View>

                    {/* ✅ BUTTON */}
                    <Pressable
                        onPress={handleCreatePet}
                        disabled={isDisabled}
                        className={`rounded-2xl py-4 items-center mt-6 ${isDisabled
                            ? "bg-gray-300"
                            : "bg-black active:opacity-80"
                            }`}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text
                                className={`font-semibold text-base ${isDisabled
                                    ? "text-gray-500"
                                    : "text-white"
                                    }`}
                            >
                                Save Pet
                            </Text>
                        )}
                    </Pressable>

                </View>
            </View>
        </ScrollView>


    );
}