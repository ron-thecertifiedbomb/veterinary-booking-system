import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAllCustomers } from "@/features/admin/hooks/useGetAllCustomers";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useEffect } from "react";
import { FlatList, Text, View, RefreshControl } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function CustomersScreen() {
  const { fetchAllCustomers, allCustomers, loading } = useGetAllCustomers();

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  // 1. Structural firewall guarding rendering cycles
  if (loading && !allCustomers) return <Loader fullScreen />;

  const renderItem = ({ item }: { item: AuthenticatedUser }) => {
    // Generate clean initials up to two characters maximum safely
    const initials = item.name
      ?.split(" ")
      .slice(0, 2)
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "??";

    return (
      <View className="bg-white dark:bg-zinc-900 rounded-3xl p-5 mb-4 border border-zinc-100 dark:border-zinc-800 shadow-sm max-w-3xl mx-auto w-full">
        {/* TOP BLOCK: Core Identity Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-3">
            {/* Minimal High-Contrast Monochrome Avatar */}
            <View className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 items-center justify-center shadow-xs">
              <Text className="text-white dark:text-zinc-900 font-black text-sm tracking-widest">
                {initials}
              </Text>
            </View>

            {/* Profile Information Block */}
            <View className="ml-3.5 flex-1">
              <Text className="font-black text-zinc-900 dark:text-zinc-50 text-base uppercase tracking-tight" numberOfLines={1}>
                {item.name || "Anonymous User"}
              </Text>
              <Text className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                ID: {item.id.slice(0, 8)}...
              </Text>
            </View>
          </View>

          {/* Premium Status Pill */}
          <View className={`px-3 py-1 rounded-full border ${item.isActive ? "bg-emerald-50/60 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900" : "bg-zinc-50 border-zinc-200 dark:bg-zinc-800/40 dark:border-zinc-700"}`}>
            <Text className={`text-[10px] font-black uppercase tracking-wider ${item.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400"}`}>
              {item.isActive ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        {/* Micro Divider Line */}
        <View className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />

        {/* BOTTOM BLOCK: High-Density Contact Layout Grid */}
        <View>
          {/* Email Row Contact Target */}
          <View className="flex-row items-center mb-[0.5px]">
            <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 mr-2.5">
              <Path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </Svg>
            <Text className="text-xs font-medium font-mono text-zinc-600 dark:text-zinc-400" numberOfLines={1}>
              {item.email || "No email address linked"}
            </Text>
          </View>

          {/* Phone Row Contact Target */}
          <View className="flex-row items-center">
            <Svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-zinc-400 mr-2.5">
              <Path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.72.73.73 0 00.58.45l2.12.92a1 1 0 01.62.61l.07.27a1 1 0 01-.48 1.11l-2.48 1.65a11 11 0 004.57 4.57l1.65-2.48a1 1 0 011.11-.48l.27.07a1 1 0 01.61.62l.92 2.12a.73.73 0 00.45.58 1 1 0 01.72.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </Svg>
            <Text className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              {item.phone || "NOT PROVIDED"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Container className="flex-1 max-w-3xl w-full  m-auto">
      {/* HEADER ELEMENT COMPONENT ROW */}
      <View className="w-full px-4 pt-6 pb-2">
        <HeaderSection title="Customer Management" />
        <Text className="text-[10px] font-black tracking-widest text-zinc-400 uppercase mt-1">
          System Account Database • Total Profiles ({allCustomers?.length || 0})
        </Text>
      </View>

      {/* RENDER LIST DATAVIEW */}
      <FlatList
        data={allCustomers || []}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchAllCustomers} tintColor="#18181B" />
        }
        ListEmptyComponent={() => (
          <View className="py-16 items-center justify-center border border-dashed border-zinc-200 rounded-3xl m-4 bg-white">
            <Text className="text-zinc-400 font-medium text-sm">No customers profiles found</Text>
          </View>
        )}
      />
    </Container>
  );
}
