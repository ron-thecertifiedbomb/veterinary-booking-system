import AppButton from "@/components/ui/AppButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import Panel from "@/components/layout/Panel";
import MobileScreen from "@/components/layout/MobileScreen";
import ToolCard from "@/components/layout/ToolCard";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useIsCompactScreen } from "@/hooks/useIsCompactScreen";
import { useMobileInsets } from "@/hooks/useMobileInsets";
import { getProfileRoutes, Role } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, RefreshControl, ScrollView, View } from "react-native";
import { ProfileCard } from "./ProfileCard";

export default function Profile() {
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuth();
  const { loading, profile, fetchUserProfile } = useGetUserProfile();
  const { isCompact, isNative } = useIsCompactScreen();
  const { screenPadding } = useMobileInsets(isNative);

  useEffect(() => {
    if (isAuthenticated) fetchUserProfile();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const response = await logout();
      showAlert("Success", response?.message || "Signed out");
      router.replace("/(auth)/login");
    } catch (err: any) {
      showAlert("Error", err.message);
    }
  };

  const handleEditRedirect = () => {
    const { edit } = getProfileRoutes(user?.role as Role | undefined);
    router.push(edit);
  };

  const isCustomer = user?.role === "CUSTOMER";
  const isWeb = Platform.OS === "web";

  const goPets = () => {
    router.push(isWeb ? "/(web)/web-pets" : "/(app)/(tabs)/pets");
  };

  const goVisits = () => {
    router.push(isWeb ? "/(web)/web-appointments" : "/(app)/(tabs)/appointments");
  };

  if (loading && !profile) return <Loader fullScreen />;
  if (!isAuthenticated) return null;

  const quickActions =
    isCustomer && isCompact ? (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
        contentContainerStyle={{ gap: 12, paddingRight: 4 }}
      >
        <ToolCard
          title="My pets"
          description="View and manage pets."
          icon="paw-outline"
          onPress={goPets}
          compact
        />
        <ToolCard
          title="My visits"
          description="Appointments history."
          icon="calendar-outline"
          onPress={goVisits}
          compact
        />
      </ScrollView>
    ) : null;

  const panel = isCompact ? (
    <>
      <HeaderSection
        title="Account"
        description="Your profile and clinic account details."
      />
      {quickActions}
      <Panel>
        <ProfileCard profile={profile} onEditPress={handleEditRedirect} />
        {isNative ? (
          <View className="mt-6">
            <AppButton label="Sign out" onPress={handleLogout} variant="outline" />
          </View>
        ) : null}
      </Panel>
    </>
  ) : (
    <Panel wide title="Account" lead="Your profile and clinic account details.">
      <ProfileCard profile={profile} onEditPress={handleEditRedirect} />
      {isNative ? (
        <View className="mt-6">
          <AppButton label="Sign out" onPress={handleLogout} variant="outline" />
        </View>
      ) : null}
    </Panel>
  );

  const scrollContent = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchUserProfile} />
      }
      contentContainerStyle={isCompact ? screenPadding : { paddingBottom: 32 }}
    >
      {panel}
    </ScrollView>
  );

  if (isCompact && isNative) {
    return (
      <MobileScreen withTabBar scroll={false}>
        <Container className="flex-1">{scrollContent}</Container>
      </MobileScreen>
    );
  }

  if (isCompact) {
    return <Container className="flex-1">{scrollContent}</Container>;
  }

  return <Container className="flex-1">{scrollContent}</Container>;
}
