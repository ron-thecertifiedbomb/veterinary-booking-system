import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useGetCustomerProfile } from "@/features/customer/hooks/useGetCustomerProfile";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getInitials } from "@/utils/getInitials/getInitials";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Platform, Pressable, Text, View } from "react-native";

export default function Profile() {

    const router = useRouter();
    const {  logout, isAuthenticated } = useAuth();

    const {loading, profile, fetchCustomerProfile} = useGetCustomerProfile()

if (!isAuthenticated) return null

 useEffect(() => {
    fetchCustomerProfile()
 }, [])

 const handleLogout = async () => {
    try {
        const response = await logout();
        const message = response.message
        showAlert("Success", message);
        router.replace("(auth)/login");
    } catch (err: any) {
        showAlert("Error", err.message); 
    }
};

    if (loading) {
        return <Loader fullScreen />;
    }
    return (
        <Container>

            <HeaderSection
                title="My Profile"
                description="View and manage your account information."

            />
            <View className="bg-surface border border-border rounded-2xl p-6 mb-4 items-center">
                {/* ✅ AVATAR */}
                <View className="w-20 h-20 rounded-full bg-black items-center justify-center mb-3">
                    <Text className="text-2xl font-bold text-white">
                        {getInitials(profile?.name)}
                    </Text>
                </View>

                <Text className="text-lg font-bold text-text-primary">
                    {profile?.name || "User"}
                </Text>
                <Text className="text-sm text-text-muted mt-0.5">
                    {profile?.email || "-"}
                </Text>

                {/* ✅ ROLE BADGE */}
                <View className="mt-3 px-3 py-1 bg-black/5 rounded-full">
                    <Text className="text-xs font-medium text-text-secondary">
                        {profile?.role === "ADMIN" ? "Administrator" : "Pet Owner"}
                    </Text>
                </View>
            </View>

            {/* ✅ DETAILS CARD */}
            <View className="bg-surface border border-border rounded-2xl overflow-hidden mb-4">

                {/* ✅ CARD HEADER */}
                <View className="flex-row justify-between items-center px-5 py-4 border-b border-border">
                    <Text className="text-sm font-semibold text-text-primary">
                        Account Details
                    </Text>
                    <Pressable
                        onPress={() => router.push(
                            Platform.OS === "web"
                                ? "/(web)/edit-profile"
                                : "(app)/edit-profile"
                        )}
                        className="px-3 py-1 rounded-full border border-border active:opacity-60"
                    >
                        <Text className="text-xs font-medium text-text-primary">
                            Edit
                        </Text>
                    </Pressable>
                </View>

                {/* ✅ FULL NAME ROW */}
                <View className="px-5 py-4 border-b border-border">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Full Name
                    </Text>
                    <Text className="text-sm font-medium text-text-primary">
                        {profile?.name || "-"}
                    </Text>
                </View>

                {/* ✅ EMAIL ROW */}
                <View className="px-5 py-4 border-b border-border">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Email Address
                    </Text>
                    <Text className="text-sm font-medium text-text-primary">
                        {profile?.email || "-"}
                    </Text>
                </View>

                {/* ✅ PHONE ROW */}
                <View className="px-5 py-4">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Phone Number
                    </Text>
                    <Text className="text-sm font-medium text-text-primary">
                        {profile?.phone || "Not provided"}
                    </Text>
                </View>
            </View>

            {/* ✅ LOGOUT — Android only */}
            {Platform.OS === "android" && (
                <Pressable
                    onPress={handleLogout}
                    disabled={loading}
                    className="bg-black rounded-2xl py-4 items-center active:opacity-80 mt-2"
                >
                    <Text className="text-white font-semibold text-sm">
                        {loading ? "Logging out..." : "Log Out"}
                    </Text>
                </Pressable>
            )}



        </Container >
    );
}