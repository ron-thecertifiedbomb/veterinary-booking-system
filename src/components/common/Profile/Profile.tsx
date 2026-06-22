import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";

import { showAlert } from "@/hooks/crossPlatformAlert";
import { Feather } from "@expo/vector-icons"; // 1. Added clean icon family library
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { ProfileCard } from "./ProfileCard";
import { useGetProfile } from "@/features/users/hook/useGetProfile";

export default function Profile() {
  const { logout, token } = useAuth();
  
  const router = useRouter();
  const { loading, profile, fetchProfile } = useGetProfile();

  
  useEffect(() => {
if (!token) return
      fetchProfile();
 
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await logout();
      showAlert("Success", response?.message || "Logged out successfully");
      router.replace("(auth)/login");
    } catch (err: any) {
      showAlert("Error", err.message);
    }
  };

  const handleEditRedirect = () => {
    router.push(
      Platform.OS === "web" ? "/(web)/profile/edit" : "(app)/profile/edit"
    );
  };

  if (loading) return <Loader />;

  const isMobile = Platform.OS === "android" || Platform.OS === "ios";

  return (
    <Container className="max-w-3xl w-full m-auto">
 
      <HeaderSection title="My Profile" />

      <ProfileCard profile={profile} onEditPress={handleEditRedirect} />
      {isMobile && (
        <View className="w-full pt-4 items-center">
          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center  gap-2 justify-center space-x-2 py-3 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 active:bg-zinc-50 shadow-sm"
          >
            <Feather 
              name="log-out" 
              size={14} 
              className="text-red-500 dark:text-red-400" 
            />
            <Text className="text-zinc-700 dark:text-zinc-300 text-xs font-bold tracking-[0.1em] uppercase">
              Log Out 
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Container>
  );
}
