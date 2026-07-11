import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import AppSafeArea from "@/components/common/AppSafeArea/AppSafeArea";
import Container from "@/components/common/Container/Container";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function AppointmentDetailScreen() {
  const { token } = useAuth();
  const { loading, singleAppointment, fetchAppointments } = useGetAppointments();
  const { id } = useLocalSearchParams<{ id?: string }>();

  useEffect(() => {
    if (token && id) fetchAppointments(id);
  }, [token, id]);

  if (loading && !singleAppointment) {
    return <Loader fullScreen />;
  }

  return (
    <AppSafeArea scroll>
      <Container>
        <View className="mb-4">
          <BackButton webRoute="/(web)/appointments" appRoute="/(app)/(tabs)/appointments" />
        </View>
        <Panel title="Visit details" lead="Appointment information and reference code.">
          <AppointmentDetailCard appointment={singleAppointment} />
        </Panel>
      </Container>
    </AppSafeArea>
  );
}
