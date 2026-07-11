import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";

export default function AppointmentScreen() {
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
    <Container>
      <View className="mb-4">
        <BackButton webRoute="/(web)/appointments" appRoute="(app)/(tabs)/appointments" />
      </View>
      <Panel wide title="Visit details" lead="Appointment information and reference code.">
        <AppointmentDetailCard appointment={singleAppointment} />
      </Panel>
    </Container>
  );
}
