import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Container from "@/components/common/Container/Container";

import { router, useFocusEffect } from "expo-router";
import { FlatList, Platform, Pressable, Text, View } from "react-native";

import { useCallback } from "react";
import { useGetPets } from "@/features/pet/hooks/useGetPet";

export default function Pets() {
    const { pets, fetchPets, loading } = useGetPets();
    const isEmpty = pets.length === 0;
    // ✅ refetch on focus
    useFocusEffect(
        useCallback(() => {
            fetchPets();
        }, [])
    );

    const handleAddPet = () => {
        const isWeb = Platform.OS === "web";
        router.push(
            isWeb ? "/(web)/web-add-pet" : "(app)/add-pet"
        );
    };

    if (loading) return <Loader fullScreen />;



    return (
        <Container>
            {/* ✅ HEADER */}
            <HeaderSection
                title="My Pets"
                description="Manage your pets and add new ones."
            />

            {isEmpty && (
                <EmptyState
                    title="No Pets Yet"
                    description="Add your first pet to start booking appointments."
                    buttonLabel="Add Pet"
                    onPress={handleAddPet}
                />
            )}

            {!isEmpty && (
                <FlatList
                    data={pets}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">

                            {/* ✅ ROW */}
                            <View className="flex-row items-center justify-between">

                                {/* PET INFO */}
                                <View>
                                    <Text className="text-base font-semibold text-gray-900">
                                        {item.petName}
                                    </Text>

                                    <Text className="text-sm text-gray-500 mt-1">
                                        {item.species} • {item.breed || "N/A"}
                                    </Text>

                                    <Text className="text-xs text-gray-400 mt-1">
                                        {item.weight} kg
                                    </Text>
                                </View>

                                {/* OPTIONAL ACTION */}
                                <Text className="text-2xl">🐾</Text>
                            </View>
                        </View>
                    )}
                />
            )}
        </Container>
    );
}