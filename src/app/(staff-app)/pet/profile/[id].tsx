import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import PetCard from "@/components/common/Pets/PetCard";
import PetDetailedCard from "@/components/common/Pets/PetDetailedCard";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetPetProfile } from "@/features/pet/hooks/useGetPetProfile";
import { router, useLocalSearchParams } from "expo-router"; // 1. Added useLocalSearchParams
import { useEffect } from "react";
import { View } from "react-native";

export default function PetProfileScreen() {

    const { token } = useAuth(); 


    const { id: petId } = useLocalSearchParams<{ id?: string }>();

const {loading, fetchPet, pet} = useGetPetProfile()

    useEffect(() => {
        if (!token || !petId) return
        fetchPet(petId)
    }, [token, petId]); 

  

    return (
        <Container className="px-4">
          <View className="w-full flex flex-row justify-start ">
            <BackButton 
                onPress={() => router.back()} 
                className="mb-4 p-1" 
            />

        
             </View>
              <PetDetailedCard item={pet} /> 
           
        </Container>
    );
}
