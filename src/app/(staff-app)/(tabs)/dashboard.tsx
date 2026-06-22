import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetStaffDashBoardMetrics } from "@/features/staff/hook/useGetStaffDashBoardMetrics";
import { useEffect } from "react";
import { Text, View, ScrollView, RefreshControl, ActivityIndicator } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function Home() {
  const { token, user } = useAuth();
  const { metrics, loading, fetchMetrics } = useGetStaffDashBoardMetrics();

  useEffect(() => {
    if (token) {
      fetchMetrics();
    }
  }, [token]);

  // ─── INITIAL LOADING STATE ───
  // Shows a spinner only on the first load before metrics exist
  if (loading && !metrics) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-950">
        <ActivityIndicator size="large" className="text-zinc-900 dark:text-zinc-50" />
      </View>
    );
  }

  const data = metrics || {
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    totalUniquePets: 0, 
  };

  const cards = [
    {
      label: "Total Assigned",
      value: data.totalAssigned,
      colorClass: "text-zinc-900 dark:text-zinc-50",
      bgClass: "bg-zinc-50 dark:bg-zinc-900/50",
      iconPath: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    },
    {
      label: "In Progress",
      value: data.inProgress,
      colorClass: "text-amber-600 dark:text-amber-400",
      bgClass: "bg-amber-50/60 dark:bg-amber-950/20",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    },
    {
      label: "Upcoming",
      value: data.upcoming,
      colorClass: "text-indigo-600 dark:text-indigo-400",
      bgClass: "bg-indigo-50/60 dark:bg-indigo-950/20",
      iconPath: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      label: "Completed",
      value: data.completed,
      colorClass: "text-emerald-600 dark:text-emerald-400",
      bgClass: "bg-emerald-50/60 dark:bg-emerald-950/20",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    },
  ];

  const greetingName = user?.name?.split(" ")[0] || "Staff";

  return (
    <ScrollView 
      className="flex-1 bg-white dark:bg-zinc-950 px-5 pt-14"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchMetrics} tintColor="#18181B" />
      }
    >
      {/* ─── HEADER SECTION ─── */}
      <View className="mb-6 pt-2">
        <Text className="text-[10px] font-black tracking-[0.15em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
       Dashboard
        </Text>
        <Text className="text-2xl font-black tracking-tighter text-zinc-950 dark:text-zinc-50 uppercase">
          Welcome!
        </Text>
      </View>

      {/* ─── METRICS GRID MATRIX ─── */}
      <View className="flex-row flex-wrap justify-between">
        {cards.map((card, index) => {
          return (
            <View
              key={index}
              className="w-[48%] p-4 bg-white dark:bg-zinc-900/30 border border-zinc-100 dark:border-zinc-900 rounded-3xl mb-4 shadow-sm justify-between min-h-[80px]"
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-[10px] font-black tracking-wider uppercase text-zinc-400 dark:text-zinc-500 flex-1 mr-2 leading-3">
                  {card.label}
                </Text>
                <View className={`p-1.5 rounded-xl ${card.bgClass}`}>
                  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={card.colorClass}>
                    <Path d={card.iconPath} />
                  </Svg>
                </View>
              </View>

              <View className="pt-4 flex-row items-baseline justify-between">
                <Text className="text-2xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                  {card.value}
                </Text>
                <Text className="text-[9px] font-bold text-zinc-400 tracking-widest uppercase">
                  Units
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}