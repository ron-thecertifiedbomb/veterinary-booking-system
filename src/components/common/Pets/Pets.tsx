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

    useFocusEffect(
        useCallback(() => {
            fetchPets();
        }, [])
    );

    const handleAddPet = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/web-add-pet" : "(app)/add-pet");
    };

    if (loading) return <Loader fullScreen />;

    return (
        <Container className="flex-1">
            <HeaderSection
                title="My Pets"
                description="Manage your pets and easily book appointments."
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
                <>
                    <FlatList
                        data={pets}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 120,
                            paddingTop: 10,
                        }}
                        renderItem={({ item }) => (
                            <View
                                className="bg-white rounded-2xl mb-4 p-5 border border-border"
                                style={{
                                    boxShadow: "0px 8px 20px rgba(2,6,23,0.06)",
                                }}
                            >
                                {/* HEADER */}
                                <View className="flex-row justify-between items-start mb-3">
                                    <View>
                                        <Text className="text-base font-semibold text-text-primary">
                                            {item.petName}
                                        </Text>

                                        <Text className="text-sm text-text-muted mt-1">
                                            {item.species} • {item.breed || "Unknown breed"}
                                        </Text>
                                    </View>

                                    {/* ✅ ICON (minimal lang) */}
                                    <Text className="text-lg opacity-70">🐾</Text>
                                </View>

                                {/* DIVIDER */}
                                <View className="h-px bg-border my-3" />

                                {/* INFO ROW */}
                                <View className="flex-row justify-between">
                                    <View>
                                        <Text className="text-xs text-text-muted">
                                            Weight
                                        </Text>
                                        <Text className="text-sm font-medium text-text-primary mt-1">
                                            {item.weight} kg
                                        </Text>
                                    </View>

                                    <View className="items-end">
                                        <Text className="text-xs text-text-muted">
                                            Status
                                        </Text>
                                        <Text className="text-sm font-medium text-text-primary mt-1">
                                            Active
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    />

                    {/* ✅ FLOATING BUTTON (WHITE THEME FRIENDLY) */}
                    <Pressable
                        onPress={handleAddPet}
                        className="absolute bottom-6 right-6 bg-black px-6 py-4 rounded-full active:opacity-80"
                        style={{
                            boxShadow: "0px 10px 20px rgba(2,6,23,0.15)",
                        }}
                    >
                        <Text className="text-white font-semibold text-sm">
                            + Add
                        </Text>
                    </Pressable>
                </>
            )}
        </Container>
    );
}