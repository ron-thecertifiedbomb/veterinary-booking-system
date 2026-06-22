import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAllPets } from "@/features/pet/hooks/useGetAllPets";
import { router } from "expo-router";
import { useEffect } from "react";
import {
    FlatList,
    Platform,
    Pressable,
    Text
} from "react-native";
import PetCard from "./PetCard";

export default function Pets() {
    const { pets, fetchPets, loading } = useGetAllPets();
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
                        renderItem={({ item }) => {
                            // Changed to { } to allow variable declarations
                            const webPath = `/pets/profile/${item.id}`;
                            const mobilePath = `/(app)/pets/profile/${item.id}`; 
                            
                            return (
                                <PetCard
                                    item={item}
                                    onPress={() => {
                                        const destination = Platform.OS === 'web' ? webPath : mobilePath;
                                        router.push(destination as any);
                                    }}
                                />
                            );
                        }}
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