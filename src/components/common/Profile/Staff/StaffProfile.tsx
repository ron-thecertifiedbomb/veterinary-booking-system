import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { Feather } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useGetProfile } from "@/features/users/hook/useGetProfile";
import { ProfileCard } from "../ProfileCard";
import { SafeAreaView } from "react-native-safe-area-context";

export default function StaffProfile() {
  
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const { loading, profile, fetchUserProfile } = useGetProfile();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserProfile();
    }
  }, [isAuthenticated]);

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
    // ✅ Removed the trailing slash again so the back button works!
    router.push("/(staff-app)/profile/edit");
  };

  if (loading) return <Loader />;
  if (!isAuthenticated) return null;

  const isMobile = Platform.OS === "android" || Platform.OS === "ios";

  // ✅ Added the missing 'return (' statement right here!
  return (
    <SafeAreaView className="flex-1 bg-zinc-50 dark:bg-zinc-950" edges={['top']}>

      <View className="px-5 pt-4 pb-2">
        <Text className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
          Clinical File
        </Text>
        <Text className="text-xl lg:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
         Profile
        </Text>
      </View>

      <ProfileCard profile={profile} onEditPress={handleEditRedirect} />
      
      {isMobile && (
        <View className="w-full pt-4 items-center">
          <TouchableOpacity 
            onPress={handleLogout}
            activeOpacity={0.7}
            className="flex-row items-center gap-2 justify-center space-x-2 py-3 px-6 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 active:bg-zinc-50 shadow-sm"
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
    </SafeAreaView>
  );
}