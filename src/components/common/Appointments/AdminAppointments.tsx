import { DateRangePicker } from "@/components/booking/DateRangePicker";
import DateSelector from "@/components/booking/DateSelector";
import AdminAppointmentCard from "@/components/common/Appointments/AdminAppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import AppButton from "@/components/ui/AppButton";
import FilterChips from "@/components/ui/FilterChips";
import {
  AdminDateFilter,
  useGetAllAppointments,
} from "@/features/admin/hooks/useGetAllAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

const DATE_FILTER_OPTIONS: { value: AdminDateFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "today", label: "Today" },
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
];

export default function AdminAppointments() {
  const { user } = useAuth();
  const {
    loading,
    isEmpty,
    appointments,
    fetchAllAppointments,
    filters,
    error,
    dateFilter,
    applyDateFilter,
    setCustomRange,
  } = useGetAllAppointments({ role: user?.role });

  const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);

  const counts = useMemo(() => {
    const upcoming = appointments.filter((item) => {
      if (item.status === "CANCELLED") return false;
      return new Date(item.appointmentDate).getTime() >= Date.now();
    }).length;

    return {
      all: appointments.length,
      upcoming,
    };
  }, [appointments]);

  const handleDateSelection = (selectedDate: string) => {
    if (activePicker === "from") {
      setCustomRange(selectedDate, filters.to);
    } else if (activePicker === "to") {
      setCustomRange(filters.from, selectedDate);
    }
    setActivePicker(null);
  };

  const clearCustomRange = () => {
    applyDateFilter("all");
  };

  if (loading && appointments.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <Container className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAllAppointments} />
        }
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Panel wide title="Appointments" lead="Clinic schedule across all customers and staff.">
          <View className="flex-row flex-wrap gap-2 mb-6">
            <View className="px-3.5 py-2 rounded-lg bg-accent">
              <Text className="text-xs font-semibold text-text-inverse font-sans">
                {counts.all} total
              </Text>
            </View>
            <View className="px-3.5 py-2 rounded-lg bg-surfaceMuted border border-border">
              <Text className="text-xs font-medium text-text-secondary font-sans">
                {counts.upcoming} upcoming
              </Text>
            </View>
          </View>

          <FilterChips
            options={DATE_FILTER_OPTIONS}
            value={dateFilter}
            onChange={applyDateFilter}
          />

          <DateRangePicker
            fromValue={filters.from}
            toValue={filters.to}
            onPress={(type) => setActivePicker(type)}
            onClear={filters.from || filters.to ? clearCustomRange : undefined}
          />

          {error ? (
            <View className="bg-dangerBg border border-red-200 rounded-lg px-4 py-3 mb-4">
              <Text className="text-sm text-danger font-sans">{error}</Text>
              <View className="mt-3">
                <AppButton
                  label="Retry"
                  onPress={fetchAllAppointments}
                  fullWidth={false}
                  size="sm"
                  variant="secondary"
                />
              </View>
            </View>
          ) : null}

          {isEmpty && !loading ? (
            <EmptyState
              title="No appointments found"
              description={
                dateFilter === "all"
                  ? "No clinic visits match the current filters."
                  : `No ${dateFilter} appointments in this range. Try All or adjust the dates.`
              }
            />
          ) : (
            <View>
              {appointments.map((item) => (
                <AdminAppointmentCard key={item.id} appointment={item} />
              ))}
              {loading ? (
                <View className="py-4">
                  <Loader />
                </View>
              ) : null}
            </View>
          )}
        </Panel>
      </ScrollView>

      <Modal
        visible={activePicker !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setActivePicker(null)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setActivePicker(null)} />
          <View className="bg-surface rounded-t-xl px-5 pt-4 pb-8 border-t border-border">
            <View className="w-10 h-1 bg-border rounded-full self-center mb-4" />
            <Text className="text-h2 text-text-primary font-semibold mb-4 font-sans">
              Select {activePicker === "from" ? "start" : "end"} date
            </Text>
            <DateSelector
              date={(activePicker === "from" ? filters.from : filters.to) || ""}
              onDateChange={handleDateSelection}
            />
          </View>
        </View>
      </Modal>
    </Container>
  );
}
