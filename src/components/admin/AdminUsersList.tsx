import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import FilterChips from "@/components/ui/FilterChips";
import UserListCard from "@/components/ui/UserListCard";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useMemo, useState } from "react";
import { FlatList, RefreshControl, ScrollView, Text, View } from "react-native";

type StatusFilter = "all" | "active" | "inactive";

const FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

type Props = {
  title: string;
  lead: string;
  users: AuthenticatedUser[] | null;
  loading: boolean;
  onRefresh: () => void;
  emptyTitle: string;
  emptyDescription: string;
  getSubtitle: (user: AuthenticatedUser) => string;
  getMeta?: (user: AuthenticatedUser) => { label: string; value: string }[];
};

function matchesFilter(user: AuthenticatedUser, filter: StatusFilter) {
  if (filter === "active") return user.isActive;
  if (filter === "inactive") return !user.isActive;
  return true;
}

export default function AdminUsersList({
  title,
  lead,
  users,
  loading,
  onRefresh,
  emptyTitle,
  emptyDescription,
  getSubtitle,
  getMeta,
}: Props) {
  const [filter, setFilter] = useState<StatusFilter>("all");

  const list = users ?? [];

  const filtered = useMemo(
    () => list.filter((user) => matchesFilter(user, filter)),
    [list, filter],
  );

  const counts = useMemo(
    () => ({
      all: list.length,
      active: list.filter((user) => user.isActive).length,
      inactive: list.filter((user) => !user.isActive).length,
    }),
    [list],
  );

  if (loading && list.length === 0) {
    return <Loader fullScreen />;
  }

  return (
    <Container className="flex-1">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <Panel wide title={title} lead={lead}>
          <View className="flex-row flex-wrap gap-2 mb-6">
            <View className="px-3.5 py-2 rounded-lg bg-accent">
              <Text className="text-xs font-semibold text-text-inverse font-sans">
                {counts.active} active
              </Text>
            </View>
            <View className="px-3.5 py-2 rounded-lg bg-surfaceMuted border border-border">
              <Text className="text-xs font-medium text-text-secondary font-sans">
                {counts.all} total
              </Text>
            </View>
          </View>

          <FilterChips options={FILTER_OPTIONS} value={filter} onChange={setFilter} />

          {filtered.length === 0 && !loading ? (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <UserListCard
                  name={item.name || "Unknown"}
                  subtitle={getSubtitle(item)}
                  email={item.email}
                  phone={item.phone}
                  isActive={item.isActive}
                  meta={getMeta?.(item)}
                />
              )}
            />
          )}

          {loading && list.length > 0 ? (
            <View className="py-4">
              <Loader />
            </View>
          ) : null}
        </Panel>
      </ScrollView>
    </Container>
  );
}
