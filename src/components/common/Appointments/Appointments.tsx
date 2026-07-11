import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Panel from "@/components/layout/Panel";
import ScreenScroll from "@/components/layout/ScreenScroll";
import AppButton from "@/components/ui/AppButton";
import FilterChips from "@/components/ui/FilterChips";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { Appointment } from "@/features/appointment/types/appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Platform, Text, View } from "react-native";

type ListFilter = "all" | "upcoming" | "past" | "cancelled";

const FILTER_OPTIONS: { value: ListFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

function isUpcoming(appointment: Appointment) {
  if (appointment.status === "CANCELLED") return false;
  const when = new Date(appointment.appointmentDate).getTime();
  return !isNaN(when) && when >= Date.now();
}

function isPast(appointment: Appointment) {
  if (appointment.status === "CANCELLED") return false;
  if (appointment.status === "COMPLETED") return true;
  const when = new Date(appointment.appointmentDate).getTime();
  return !isNaN(when) && when < Date.now();
}

function matchesFilter(appointment: Appointment, filter: ListFilter) {
  switch (filter) {
    case "upcoming":
      return isUpcoming(appointment);
    case "past":
      return isPast(appointment);
    case "cancelled":
      return appointment.status === "CANCELLED";
    default:
      return true;
  }
}

function SectionHeader({ title, count }: { title: string; count: number }) {
  return (
    <View className="flex-row items-center justify-between mb-3 mt-2">
      <Text className="text-sm font-semibold text-text-primary font-sans">{title}</Text>
      <Text className="text-xs text-text-muted font-sans">{count}</Text>
    </View>
  );
}

function renderSection(title: string, items: Appointment[]) {
  if (items.length === 0) return null;
  return (
    <View key={title}>
      <SectionHeader title={title} count={items.length} />
      {items.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </View>
  );
}

export default function Appointments() {
  const { token } = useAuth();
  const { loading, appointments, fetchAppointments } = useGetAppointments();
  const [filter, setFilter] = useState<ListFilter>("all");
  const isWeb = Platform.OS === "web";
  const { isCompact, isNarrow, isNative } = useIsCompactScreen();

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const filtered = useMemo(
    () => appointments.filter((item) => matchesFilter(item, filter)),
    [appointments, filter],
  );

  const upcoming = useMemo(
    () =>
      filtered
        .filter(isUpcoming)
        .sort(
          (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime(),
        ),
    [filtered],
  );

  const past = useMemo(
    () =>
      filtered
        .filter(isPast)
        .sort(
          (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime(),
        ),
    [filtered],
  );

  const cancelled = useMemo(
    () =>
      filtered
        .filter((item) => item.status === "CANCELLED")
        .sort(
          (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime(),
        ),
    [filtered],
  );

  const counts = useMemo(
    () => ({
      all: appointments.length,
      upcoming: appointments.filter(isUpcoming).length,
      past: appointments.filter(isPast).length,
      cancelled: appointments.filter((item) => item.status === "CANCELLED").length,
    }),
    [appointments],
  );

  const handleBook = () => {
    router.push(isWeb ? "/(web)/web-home" : "/(app)/(tabs)/home");
  };

  if (loading && appointments.length === 0) {
    return <Loader fullScreen />;
  }

  const listContent =
    filter === "all" ? (
      <>
        {renderSection("Upcoming", upcoming)}
        {renderSection("Past visits", past)}
        {renderSection("Cancelled", cancelled)}
      </>
    ) : (
      filtered.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))
    );

  const isEmptyList =
    filter === "all"
      ? upcoming.length === 0 && past.length === 0 && cancelled.length === 0
      : filtered.length === 0;

  return (
    <ScreenScroll withTabBar={isNative} refreshing={loading} onRefresh={fetchAppointments}>
      <Container className={isWeb ? "max-w-4xl mx-auto w-full" : undefined}>
        <Panel wide={!isCompact} title="Visits" lead="Your appointment history and upcoming schedules.">
          <View className="gap-3 mb-6">
            <View className="flex-row flex-wrap gap-2">
              <View className="px-3.5 py-2 rounded-lg bg-accent">
                <Text className="text-xs font-semibold text-text-inverse font-sans">
                  {counts.upcoming} upcoming
                </Text>
              </View>
              <View className="px-3.5 py-2 rounded-lg bg-surfaceMuted border border-border">
                <Text className="text-xs font-medium text-text-secondary font-sans">
                  {counts.all} total
                </Text>
              </View>
            </View>
            <AppButton
              label="Schedule"
              onPress={handleBook}
              fullWidth={isNarrow}
              size="sm"
            />
          </View>

          <FilterChips options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

          {isEmptyList && !loading ? (
            <EmptyState
              title={filter === "all" ? "No visits yet" : `No ${filter} visits`}
              description={
                filter === "cancelled"
                  ? "Cancelled appointments will appear here."
                  : "Book your first appointment to get started."
              }
              buttonLabel="Book a visit"
              onPress={handleBook}
            />
          ) : (
            <View>{listContent}</View>
          )}

          {loading && appointments.length > 0 ? (
            <View className="py-4">
              <Loader />
            </View>
          ) : null}
        </Panel>
      </Container>
    </ScreenScroll>
  );
}
