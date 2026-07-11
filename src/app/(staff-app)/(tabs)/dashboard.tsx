import AppSafeArea from "@/components/common/AppSafeArea/AppSafeArea";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetStaffDashBoardMetrics } from "@/features/staff/hook/useGetStaffDashBoardMetrics";
import { colors } from "@/theme/tokens";
import { useEffect } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const cards = [
  {
    label: "Assigned",
    key: "totalAssigned" as const,
    colorClass: "text-text-primary",
    bgClass: "bg-surfaceMuted",
    iconPath:
      "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
  },
  {
    label: "In progress",
    key: "inProgress" as const,
    colorClass: "text-warning",
    bgClass: "bg-warningBg",
    iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Upcoming",
    key: "upcoming" as const,
    colorClass: "text-accent",
    bgClass: "bg-accentSoft",
    iconPath:
      "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "Completed",
    key: "completed" as const,
    colorClass: "text-success",
    bgClass: "bg-successBg",
    iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
];

export default function StaffDashboard() {
  const { token } = useAuth();
  const { metrics, loading, fetchMetrics } = useGetStaffDashBoardMetrics();

  useEffect(() => {
    if (token) fetchMetrics();
  }, [token]);

  const data = metrics || {
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    upcoming: 0,
    totalUniquePets: 0,
  };

  return (
    <AppSafeArea scroll padded>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchMetrics}
            tintColor={colors.accent}
          />
        }
      >
        <HeaderSection
          title="Today's schedule"
          description="Overview of your assigned appointments."
        />

        <View className="flex-row flex-wrap justify-between">
          {cards.map((card) => (
            <View
              key={card.key}
              className="w-[48%] p-4 bg-surface border border-border rounded-xl mb-3 min-h-[96px] justify-between"
            >
              <View className="flex-row justify-between items-start">
                <Text className="text-micro text-text-muted flex-1 mr-2">{card.label}</Text>
                <View className={`p-1.5 rounded-lg ${card.bgClass}`}>
                  <Svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={card.colorClass}
                  >
                    <Path d={card.iconPath} />
                  </Svg>
                </View>
              </View>
              <Text className="text-2xl font-bold text-text-primary pt-3">
                {data[card.key]}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </AppSafeArea>
  );
}
