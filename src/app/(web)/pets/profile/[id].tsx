import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { logger } from "@/utils/logger/logger";
import { useLocalSearchParams } from "expo-router"; // 1. Added useLocalSearchParams
import { useEffect } from "react";
import { View } from "react-native";

export default function PetProfileScreen() {

    const { token } = useAuth(); 


    const { id } = useLocalSearchParams<{ id?: string }>();

    useEffect(() => {
        if (token) {
          
       logger.info('Pet ID', id)
        }
    }, [token, id]); 

  

    return (
        <Container>
            <View className="w-full flex flex-row justify-center px-10">
            <HeaderSection
                title={"Pet Details"}
            />
             <BackButton webRoute="/(web)/pets" appRoute="(app)/(tabs)/pets" /> 
             </View>
                    {/* <AppointmentDetailCard appointment={singleAppointment} /> */}
           
        </Container>
    );
}
