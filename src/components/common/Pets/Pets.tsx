import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";



import {
    router,
    useFocusEffect,
} from "expo-router";

import {
    FlatList,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { useCallback } from "react";
import { useGetPets } from "@/features/pet/hooks/useGetPet";

export default function Pets() {
    const {
        pets,
        fetchPets,
        loading,
    } = useGetPets();

    // ✅ refetch pets on focus
    useFocusEffect(
        useCallback(() => {
            fetchPets();
        }, [])
    );

    const handleAddPet = () => {
        const isWeb = Platform.OS === "web";

        router.push(
            isWeb
                ? "/(web)/web-add-pet"
                : "(app)/add-pet"
        );
    };

    const isEmpty = pets.length === 0;

    return (
        <>
            {/* ✅ GLOBAL LOADER */}
            {loading && <Loader />}

            <ScrollView
                className="flex-1 bg-background"
                contentContainerClassName="items-center px-6 pb-10"
                keyboardShouldPersistTaps="handled"
            >
                <View className="w-full max-w-3xl pt-6 lg:p-14">

                    {/* ✅ HEADER */}
                    <View className="mb-6">
                        <Text className="text-lg lg:text-3xl font-semibold text-text-primary">
                            My Pets
                        </Text>

                        <Text className="text-sm text-text-secondary mt-1">
                            Easily manage your pets for faster booking.
                        </Text>
                    </View>

                    {/* ✅ EMPTY STATE */}
                    {isEmpty && !loading && (
                        <EmptyState
                            icon="🐾"
                            title="No pets yet"
                            description="Add your first pet to start booking."
                            buttonLabel="Add Pet"
                            onPress={handleAddPet}
                        />
                    )}

                    {/* ✅ PET LIST */}
                    {!isEmpty && (
                        <FlatList
                            data={pets}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            contentContainerStyle={{
                                paddingBottom: 40,
                            }}
                            renderItem={({ item }) => (
                                <View className="bg-surface border border-border rounded-2xl p-5 mb-3">

                                    {/* ✅ NAME */}
                                    <Text className="text-xs text-text-muted">
                                        Name
                                    </Text>

                                    <Text className="text-base font-semibold text-text-primary mb-2">
                                        {item.petName}
                                    </Text>

                                    {/* ✅ BREED */}
                                    {item.breed && (
                                        <>
                                            <Text className="text-xs text-text-muted">
                                                Breed
                                            </Text>

                                            <Text className="text-sm text-text-primary mb-2">
                                                {item.breed}
                                            </Text>
                                        </>
                                    )}

                                    {/* ✅ SPECIES */}
                                    <Text className="text-xs text-text-muted">
                                        Species
                                    </Text>

                                    <Text className="text-sm text-text-primary mb-2">
                                        {item.species}
                                    </Text>

                                    {/* ✅ WEIGHT */}
                                    {item.weight && (
                                        <>
                                            <Text className="text-xs text-text-muted">
                                                Weight
                                            </Text>

                                            <Text className="text-sm text-text-primary">
                                                {item.weight} kg
                                            </Text>
                                        </>
                                    )}
                                </View>
                            )}
                            ListFooterComponent={
                                <Pressable
                                    className="bg-black rounded-2xl py-4 items-center mt-4 mb-10 active:opacity-80"
                                    onPress={handleAddPet}
                                >
                                    <Text className="text-white font-semibold">
                                        Add Another Pet
                                    </Text>
                                </Pressable>
                            }
                        />
                    )}
                </View>
            </ScrollView>
        </>
    );
}