import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetCustomerProfile } from "@/features/customer/hooks/useGetCustomerProfile";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();
  const { loading, profile, fetchCustomerProfile } = useGetCustomerProfile();

  if (!isAuthenticated) return null;

  useEffect(() => {
    fetchCustomerProfile();
  }, []);

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
      Platform.OS === "web" ? "/(web)/profile/edit" : "(app)/edit-profile"
    );
  };

  if (loading) return <Loader fullScreen />;

  // 1. Explicit platform check for mobile environments
  const isMobile = Platform.OS === "android" || Platform.OS === "ios";

  return (
    <Container>
      {/* ─── TITLE HEADLINE ─── */}
      <HeaderSection title="My Profile" />

      {/* ─── HERO CARD SECTION ─── */}
      <View className="bg-white dark:bg-black p-6 rounded-3xl space-y-6 mb-4 border border-zinc-200 dark:border-zinc-800">
        
        {/* Core Identity row block */}
        <View className="flex-row justify-between items-start pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <View className="flex-1 mr-4">
            <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
              Account Holder
            </Text>
            <Text className="text-2xl font-black tracking-tighter text-black dark:text-white uppercase">
              {profile?.name || "User"}
            </Text>
            <Text className="text-xs font-mono font-bold tracking-tight text-zinc-500 dark:text-zinc-400 mt-1">
              {profile?.email || "—"}
            </Text>
          </View>

          {/* Stark monochrome role pillar badge */}
          <View className="bg-transparent px-3 py-1 border border-black dark:border-white rounded-full">
            <Text className="text-[9px] font-black tracking-widest uppercase text-black dark:text-white">
              {profile?.role === "ADMIN" ? "ADMIN" : "OWNER"}
            </Text>
          </View>
        </View>

        {/* ─── ACCOUNT DATA LABELS ─── */}
        <View className="space-y-4">
          <View className="flex-row justify-between items-center py-1">
            <View className="flex-1">
              <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                Contact Phone
              </Text>
              <Text className="text-sm font-bold text-black dark:text-white uppercase">
                {profile?.phone || "NOT PROVIDED"}
              </Text>
            </View>
            
            <View className="w-[1px] h-8 bg-zinc-200 dark:bg-zinc-800 mx-6" />
            
            <View className="flex-1">
              <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
                System Status
              </Text>
              <Text className="text-sm font-bold text-black dark:text-white uppercase">
                VERIFIED
              </Text>
            </View>
          </View>
        </View>

        {/* ─── INNER INTERACTIVE CONTROL ROW ─── */}
        <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-4 flex-row justify-between items-center">
          <View className="flex-1 mr-4">
            <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 dark:text-zinc-500 mb-1">
              Profile Configurations
            </Text>
            <Text className="text-xs font-bold tracking-tight text-zinc-800 dark:text-zinc-200 uppercase">
              Modify account info or phone credentials
            </Text>
          </View>
          <TouchableOpacity 
            onPress={handleEditRedirect} 
            activeOpacity={0.85}
            className="bg-black dark:bg-white px-4 py-2 rounded-full"
          >
            <Text className="text-white dark:text-black text-[10px] font-black tracking-widest uppercase">
              Edit
            </Text>
          </TouchableOpacity>
        </View>

      </View>

      {/* ─── 2. MOBILE ONLY LOGOUT TRIGGER ─── */}
      {isMobile && (
        <TouchableOpacity 
          onPress={handleLogout}
          activeOpacity={0.9}
          className="w-full bg-black dark:bg-white py-4 rounded-full items-center mt-2 border border-black dark:border-white"
        >
          <Text className="text-white dark:text-black text-xs font-black tracking-[0.2em] uppercase">
            Log Out Account
          </Text>
        </TouchableOpacity>
      )}

    </Container>
  );
}
