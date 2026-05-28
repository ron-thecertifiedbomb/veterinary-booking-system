import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View, FlatList, Platform, ScrollView } from "react-native";

import Loader from "@/components/common/Loader/Loader";
import { useGetPets } from "@/features/pet/useGetPet";

export default function Pets() {
    const { pets, fetchPets, loading, error } = useGetPets();
    const { refresh } = useLocalSearchParams();

    const handleAddPet = () => {
        const isWeb = Platform.OS === "web";

        router.push(
            isWeb
                ? "/(web)/add-pet"
                : "/add-pet"
        );
    };

    useEffect(() => {
        fetchPets();
    }, []);

    useEffect(() => {
        if (refresh) fetchPets();
    }, [refresh]);

    if (loading) return <Loader fullScreen />;

    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-red-500 text-sm">{error}</Text>
            </View>
        );
    }

    const isEmpty = pets.length === 0;

    return (
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
                {isEmpty && (
                    <View className="bg-surface border border-border rounded-2xl p-6 items-center">

                        <Text className="text-4xl mb-3">🐾</Text>

                        <Text className="text-lg font-semibold text-text-primary">
                            No pets yet
                        </Text>

                        <Text className="text-sm text-text-secondary text-center mt-1">
                            Add your first pet to start booking.
                        </Text>

                        <Pressable
                            className="bg-black rounded-xl px-6 py-3 mt-5 active:opacity-80"
                            onPress={handleAddPet}
                        >
                            <Text className="text-white font-semibold text-sm">
                                Add Pet
                            </Text>
                        </Pressable>
                    </View>
                )}

                {/* ✅ PET LIST */}
                {!isEmpty && (
                    <FlatList
                        data={pets}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}

                        renderItem={({ item }) => (
                            <View className="bg-surface border border-border rounded-2xl p-5 mb-3">

                                {/* ✅ Name */}
                                <Text className="text-xs text-text-muted">Name</Text>
                                <Text className="text-base font-semibold text-text-primary mb-2">
                                    {item.name}
                                </Text>

                                {/* ✅ Breed */}
                                {item.breed && (
                                    <>
                                        <Text className="text-xs text-text-muted">Breed</Text>
                                        <Text className="text-sm text-text-primary mb-2">
                                            {item.breed}
                                        </Text>
                                    </>
                                )}

                                {/* ✅ Species */}
                                <Text className="text-xs text-text-muted">Species</Text>
                                <Text className="text-sm text-text-primary mb-2">
                                    {item.species}
                                </Text>

                                {/* ✅ Weight */}
                                {item.weight && (
                                    <>
                                        <Text className="text-xs text-text-muted">Weight</Text>
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
    );
}