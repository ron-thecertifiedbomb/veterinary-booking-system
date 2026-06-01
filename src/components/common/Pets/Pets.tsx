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
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";

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
    if (loading) return <Loader fullScreen />;
    return (
        
            <View className=" bg-background px-6 flex-1" >
                        <HeaderSection
                        title="My Pets"
                        description="Easily manage your pets for faster booking."
                        />
                    {isEmpty && (
                        <EmptyState
                            title="No pets yet"
                            description="Add your first pet to start booking."
                            buttonLabel="Add Pet"
                            onPress={handleAddPet}
                        />
                    )}

                    {!isEmpty && (
                        <FlatList
                            data={pets}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingBottom: 40 }}
                            renderItem={({ item }) => (
                                <View className="bg-surface border border-border rounded-2xl p-5 mb-3">
                                    {/* ✅ HEADER ROW */}
                                    <View className="flex-row items-center justify-between mb-4">
                                        <View className="flex-row items-center gap-3">
                                            {/* ✅ AVATAR */}
                                            <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center">
                                                <Text className="text-xl">
                                                    {item.species === "Dog" ? "🐶"
                                                        : item.species === "Cat" ? "🐱"
                                                            : item.species === "Bird" ? "🐦"
                                                                : item.species === "Rabbit" ? "🐰"
                                                                    : "🐾"}
                                                </Text>
                                            </View>

                                            <View>
                                                <Text className="text-base font-semibold text-text-primary">
                                                    {item.petName}
                                                </Text>
                                                <Text className="text-xs text-text-muted">
                                                    {item.species}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* ✅ DIVIDER */}
                                    <View className="h-px bg-border mb-4" />

                                    {/* ✅ DETAILS ROW */}
                                    <View className="flex-row gap-4">
                                        {item.breed && (
                                            <View className="flex-1">
                                                <Text className="text-xs text-text-muted mb-1">
                                                    Breed
                                                </Text>
                                                <Text className="text-sm font-medium text-text-primary">
                                                    {item.breed}
                                                </Text>
                                            </View>
                                        )}

                                        {item.weight && (
                                            <View className="flex-1">
                                                <Text className="text-xs text-text-muted mb-1">
                                                    Weight
                                                </Text>
                                                <Text className="text-sm font-medium text-text-primary">
                                                    {item.weight} kg
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                            ListFooterComponent={
                                <Pressable
                                    className="bg-black rounded-2xl py-4 items-center mt-4 mb-10 active:opacity-80"
                                    onPress={handleAddPet}
                                >
                                    <Text className="text-white font-semibold text-base">
                                        + Add Another Pet
                                    </Text>
                                </Pressable>
                            }
                        />
                    )}
                </View>
        
        
    );
}