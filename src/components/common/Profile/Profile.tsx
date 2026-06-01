import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getInitials } from "@/utils/getInitials/getInitials";
import { getRouteByRole } from "@/utils/routes/routeResolver";
import { useRouter } from "expo-router";
import { Platform, Pressable, ScrollView, Text, View } from "react-native";

export default function Profile() {
    
    const router = useRouter();
    const { user, loading, logout, isAuthenticated } = useAuth();

    const handleLogout = async () => {
        const response = await logout();
        if (response) showAlert("Success", response.message);
        // ✅ allow AuthProvider to update state first
        setTimeout(() => {
            const target = getRouteByRole(
                user?.role,
                isAuthenticated
            );
            router.replace(target);
        }, 2);
    };
    

    if (loading) { 
        return <Loader fullScreen />;
    }

    return (
    <Container>
                <View className="w-full max-w-3xl">
                    <View className="w-full max-w-3xl">
                        <HeaderSection
                            title="My Profile"
                            description="View and manage your account information."
                        
/>
            
                    </View>

                    {/* ✅ PROFILE HERO CARD */}
                    <View className="bg-surface border border-border rounded-2xl p-6 mb-4 items-center">

                        {/* ✅ AVATAR */}
                        <View className="w-20 h-20 rounded-full bg-black items-center justify-center mb-3">
                            <Text className="text-2xl font-bold text-white">
                                {getInitials(user?.name)}
                            </Text>
                        </View>

                        <Text className="text-lg font-bold text-text-primary">
                            {user?.name || "User"}
                        </Text>
                        <Text className="text-sm text-text-muted mt-0.5">
                            {user?.email || "-"}
                        </Text>

                        {/* ✅ ROLE BADGE */}
                        <View className="mt-3 px-3 py-1 bg-black/5 rounded-full">
                            <Text className="text-xs font-medium text-text-secondary">
                                {user?.role === "ADMIN" ? "Administrator" : "Pet Owner"}
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
                                {user?.name || "-"}
                            </Text>
                        </View>

                        {/* ✅ EMAIL ROW */}
                        <View className="px-5 py-4 border-b border-border">
                            <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                                Email Address
                            </Text>
                            <Text className="text-sm font-medium text-text-primary">
                                {user?.email || "-"}
                            </Text>
                        </View>

                        {/* ✅ PHONE ROW */}
                        <View className="px-5 py-4">
                            <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                                Phone Number
                            </Text>
                            <Text className="text-sm font-medium text-text-primary">
                                {user?.phone || "Not provided"}
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

                </View>
        
</Container >
    );
}