import BookingSuccessModal from "@/components/booking/BookingSuccessModal";
import DateSelector from "@/components/booking/DateSelector";
import AppBookingModal from "@/components/common/AppModal/AppBookingModal";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import InfoBox from "@/components/layout/InfoBox";
import Panel from "@/components/layout/Panel";
import ScreenScroll from "@/components/layout/ScreenScroll";
import ToolCard from "@/components/layout/ToolCard";
import { useCreateAppointment } from "@/features/appointment/hooks/useCreateAppointment";
import { useGetSlots } from "@/features/appointment/hooks/useGetSlots";
import {
  CreateAppointmentPayload,
  CreateAppointmentResponse,
} from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetPets } from "@/features/pet/hooks/useGetPet";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { getTodayDate } from "@/utils/appointments/formatter";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, View } from "react-native";

export default function Home() {
  const { fetchSlots, slots, loading: slotsLoading } = useGetSlots();
  const { createAppointment, loading: creating } = useCreateAppointment();
  const { user, token, refreshSession } = useAuth();
  const {
    pets: fetchedPets,
    fetchPets,
    loading: petsLoading,
    fetched: petsFetched,
    message: petsError,
  } = useGetPets();

  const [date, setDate] = useState(getTodayDate());
  const [showModal, setShowModal] = useState(false);
  const [bookingSummary, setBookingSummary] =
    useState<CreateAppointmentResponse | null>(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const isWeb = Platform.OS === "web";
  const { isCompact, isNative } = useIsCompactScreen();

  const pets = useMemo(() => {
    if (fetchedPets.length > 0) return fetchedPets;
    return user?.customerProfile?.pets ?? [];
  }, [fetchedPets, user?.customerProfile?.pets]);

  useEffect(() => {
    if (token) fetchPets();
  }, [token]);

  const handleSelectDate = async (newDate: string) => {
    setDate(newDate);
    setShowModal(true);
    await fetchSlots(newDate);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (formData: CreateAppointmentPayload) => {
    try {
      if (creating) return;

      const response = await createAppointment(formData);
      setBookingSummary(response);
      setShowModal(false);
      setTimeout(() => {
        setSuccessModalVisible(true);
      }, 500);
      refreshSession();
    } catch (err: any) {
      showAlert("Error", err?.message);
    }
  };

  const goAppointments = () =>
    router.push(isWeb ? "/(web)/web-appointments" : "/(app)/(tabs)/appointments");

  const goPets = () =>
    router.push(isWeb ? "/(web)/web-pets" : "/(app)/(tabs)/pets");

  const goAddPet = () =>
    router.replace(isWeb ? "/(web)/web-add-pet" : "/(app)/add-pet");

  if (!petsFetched || (petsLoading && pets.length === 0)) {
    return <Loader fullScreen />;
  }

  if (petsError && pets.length === 0) {
    return (
      <ScreenScroll withTabBar={isNative}>
        <Container>
          <HeaderSection
            title="Schedule appointment"
            description="Select a date to view available clinic time slots."
          />
          <EmptyState
            title="Could not load pets"
            description={petsError}
            buttonLabel="Try again"
            onPress={() => fetchPets()}
          />
        </Container>
      </ScreenScroll>
    );
  }

  const page = (
    <Container className={isWeb ? "max-w-4xl mx-auto w-full" : undefined}>
      <HeaderSection
        title="Schedule appointment"
        description="Select a date to view available clinic time slots."
      />

      {pets.length === 0 ? (
        <EmptyState
          title="No registered pet"
          description="Add a pet before booking your first visit."
          buttonLabel="Register your pet"
          onPress={goAddPet}
        />
      ) : (
        <>
          {isCompact ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-5"
              contentContainerStyle={{ gap: 12, paddingRight: 8 }}
            >
              <ToolCard
                title="Book visit"
                description="Pick a date and time."
                icon="calendar-outline"
                onPress={() => handleSelectDate(date)}
                compact
              />
              <ToolCard
                title="My visits"
                description="View appointments."
                icon="list-outline"
                onPress={goAppointments}
                compact
              />
              <ToolCard
                title="My pets"
                description="Manage profiles."
                icon="paw-outline"
                onPress={goPets}
                compact
              />
            </ScrollView>
          ) : null}

          <Panel title="Appointment calendar" lead="Tap a date to continue scheduling.">
            <DateSelector date={date} onDateChange={handleSelectDate} />
          </Panel>

          {!isCompact && isWeb ? (
            <View className="mt-6">
              <InfoBox
                title="Quick links"
                items={[
                  "Use the sidebar to jump between visits, pets, and your profile.",
                  "After booking, confirmation details appear on the visits page.",
                ]}
              />
            </View>
          ) : null}
        </>
      )}

      {pets.length > 0 ? (
        <AppBookingModal
          loading={slotsLoading || creating}
          pets={pets}
          slots={slots}
          date={date}
          visible={showModal}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      ) : null}

      <BookingSuccessModal
        visible={successModalVisible}
        items={bookingSummary}
        onClose={() => {
          setSuccessModalVisible(false);
          goAppointments();
        }}
      />
    </Container>
  );

  return <ScreenScroll withTabBar={isNative}>{page}</ScreenScroll>;
}
