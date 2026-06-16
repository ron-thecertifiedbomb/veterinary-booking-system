import { useGetStaffDashBoardMetrics } from "@/features/staff/hook/useGetStaffDashBoardMetrics";
import { logger } from "@/utils/logger/logger";
import { useEffect } from "react";
import { Text, View, ScrollView, RefreshControl } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Home() {
  const { metrics, loading, fetchMetrics } = useGetStaffDashBoardMetrics();

  useEffect(() => {
    fetchMetrics();
  }, []);

  logger.info("Metrics", metrics);

  const data = metrics || {
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
  };

  const cards = [
    {
      label: "Total Assigned",
      value: data.totalAssigned,
      iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
    },
    {
      label: "In Progress",
      value: data.inProgress,
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      label: "Upcoming",
      value: data.upcoming,
      iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      label: "Completed",
      value: data.completed,
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    },
  ];

  return (
    <ScrollView 
      className="flex-1 bg-zinc-50 dark:bg-black px-6 pt-16"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchMetrics} tintColor="#A1A1AA" />
      }
    >
      {/* ─── HEADER SECTION ─── */}
      <View className="flex-row justify-between items-center mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <View>
          <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
            Clinical Hub
          </Text>
          <Text className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase">
            Welcome Dr. Strange!
          </Text>
        </View>
      </View>

      {/* ─── LIVE SYNC STATUS BANNER ─── */}
      <View className="flex-row items-center space-x-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl mb-6">
        <View className={`h-1.5 w-1.5 rounded-full ${loading ? 'bg-zinc-400 animate-pulse' : 'bg-black dark:bg-white'}`} />
        <Text className="text-[9px] font-black tracking-[0.15em] uppercase text-zinc-500 dark:text-zinc-400">
          {loading ? "Syncing core modules..." : "Metrics synchronized"}
        </Text>
      </View>

      {/* ─── METRICS GRID MATRIX ─── */}
      <View className="flex-row flex-wrap justify-between">
        {cards.map((card, index) => {
          const hasValue = card.value > 0;

          return (
            <View
              key={index}
              className="w-[48%] p-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 rounded-3xl mb-4 space-y-4"
            >
              {/* Card Label and Mini Svg Icon Row */}
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-[9px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 max-w-[70%]">
                  {card.label}
                </Text>
                <View className="p-1.5 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 dark:text-zinc-500">
                    <Path d={card.iconPath} />
                  </Svg>
                </View>
              </View>

              {/* Counter Value and Status Capsule */}
              <View className="flex-row justify-between items-baseline mt-1">
                <Text className="text-3xl font-black text-black dark:text-white tracking-tighter">
                  {card.value}
                </Text>
                
                {/* Pill action badge */}
                <View className={`px-2 py-0.5 rounded-full border ${hasValue ? 'border-black dark:border-white bg-black dark:bg-white' : 'border-zinc-200 dark:border-zinc-800 bg-transparent'}`}>
                  <Text className={`text-[8px] font-black tracking-wider uppercase ${hasValue ? 'text-white dark:text-black' : 'text-zinc-400 dark:text-zinc-600'}`}>
                    {hasValue ? "Active" : "Zero"}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
