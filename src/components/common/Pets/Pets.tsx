import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Container from "@/components/common/Container/Container";
import { router } from "expo-router";
import {
    FlatList,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";
import { useEffect } from "react";
import { useGetPets } from "@/features/pet/hooks/useGetPet";
import PetCard from "../PetCard/PetCard";

export default function Pets() {
    const { pets, fetchPets, loading } = useGetPets();
    const isEmpty = pets.length === 0;

    useEffect(() => {
        fetchPets();
    }, []);

    const handleAddPet = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/pets/add" : "(app)/add-pet");
    };

    if (loading) return <Loader fullScreen />;

    return (
        <Container className="flex-1">
            {/* ✅ HEADER */}
            <HeaderSection
                title="My Pets"
            />

            {/* ✅ EMPTY */}
            {isEmpty && (
                <EmptyState
                    title="No Pets Yet"
                    description="Add your first pet to start booking appointments."
                    buttonLabel="Add Pet"
                    onPress={handleAddPet}
                />
            )}

            {/* ✅ LIST */}
            {!isEmpty && (
                <>
                    <FlatList
                        data={pets}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingTop: 8,
                            paddingBottom: 140,
                        }}
                        
                        renderItem={({ item }) => (
                            <PetCard
                                item={item}
                                onPress={() => router.push(`/pets/profile/${item.id}`)}
                            />
                        )}
                    />

                    {/* ✅ FLOATING BUTTON */}
                    <Pressable
                        onPress={handleAddPet}
                        style={({ pressed }) => ({
                            position: "absolute",
                            bottom: 50,
                            right: 50,
                            flexDirection: "row",
                            alignItems: "center",
                            borderRadius: 999,
                            paddingVertical: 14,
                            paddingHorizontal: 18,
                            backgroundColor: "#000",
                            transform: [
                                {
                                    scale: pressed ? 0.93 : 1,
                                },
                            ],
                            shadowColor: "#000",
                            shadowOpacity: 0.2,
                            shadowRadius: 12,
                            shadowOffset: {
                                width: 0,
                                height: 8,
                            },
                            elevation: 8,
                        })}
                    >
                        <Text className="text-white text-lg mr-1">
                            +
                        </Text>
                        <Text className="text-white font-semibold text-sm">
                            Add Pet
                        </Text>
                    </Pressable>
                </>
            )}
        </Container>
    );
}