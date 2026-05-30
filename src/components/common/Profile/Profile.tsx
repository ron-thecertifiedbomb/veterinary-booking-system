import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { getInitials } from "@/utils/getInitials/getInitials";

import { useRouter } from "expo-router";

import { Platform, Pressable, ScrollView, Text, View } from "react-native";

export default function Profile() {
    const router = useRouter();

    const { user, loading, logout } = useAuth();

    const handleLogout = async () => {
        const response = await logout();

        if (response) {
            showAlert("Success", response.message);
        }
        router.replace("/(auth)/login");
    };

    return (
        <>
            {loading && <Loader />}

            <ScrollView
                className="flex-1 bg-background"
                contentContainerClassName="items-center px-6 pb-10"
                keyboardShouldPersistTaps="handled"
            >
                <View className="w-full max-w-3xl pt-6 lg:p-14">

                    {/* ✅ HEADER */}
                    <View className="mb-6">
                        <Text className="text-lg lg:text-3xl font-semibold text-text-primary">
                            My Profile
                        </Text>
                        <Text className="text-sm text-text-secondary mt-1">
                            View and manage your account information.
                        </Text>
                    </View>

                    {/* ✅ PROFILE CARD */}
                    <View className="bg-surface border border-border rounded-2xl p-5">

                        {/* ✅ TOP BAR (EDIT BUTTON RIGHT) */}
                        <View className="flex-row justify-between items-center mb-4">
                            <Text className="text-sm font-semibold text-text-muted">
                                Account Details
                            </Text>


                            <Pressable
                                onPress={() =>
                                    router.push(
                                        Platform.OS === "web"
                                            ? "/(web)/edit-profile"
                                            : "(app)/edit-profile"
                                    )
                                }
                                className="px-3 py-1 rounded-full border border-border active:opacity-80"
                            >

                                <Text className="text-xs font-medium text-text-primary">
                                    Edit
                                </Text>
                            </Pressable>
                        </View>

                        {/* ✅ PROFILE HEADER */}
                        <View className="items-center mb-5">

                            <View className="bg-gray-200 rounded-full w-16 h-16 items-center justify-center">
                                <Text className="text-xl font-semibold text-gray-600">
                                    {getInitials(user?.name)}
                                </Text>
                            </View>

                            <Text className="text-base font-semibold text-text-primary mt-3">
                                {user?.name || "User"}
                            </Text>

                            <Text className="text-xs text-text-secondary mt-1">
                                {user?.email || "-"}
                            </Text>
                        </View>

                        {/* ✅ DIVIDER */}
                        <View className="border-t border-border my-4" />

                        {/* ✅ DETAILS */}
                        <View className="gap-4">

                            <View>
                                <Text className="text-[11px] uppercase text-text-muted mb-1">
                                    Full Name
                                </Text>
                                <Text className="text-sm text-text-primary">
                                    {user?.name || "-"}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-[11px] uppercase text-text-muted mb-1">
                                    Email
                                </Text>
                                <Text className="text-sm text-text-primary">
                                    {user?.email || "-"}
                                </Text>
                            </View>

                            <View>
                                <Text className="text-[11px] uppercase text-text-muted mb-1">
                                    Phone
                                </Text>
                                <Text className="text-sm text-text-primary">
                                    {user?.phone || "Not provided"}
                                </Text>
                            </View>

                        </View>
                    </View>

                    {/* ✅ FOOTER ACTION */}

                    {Platform.OS === "android" && (

                        <View className="mt-10">
                            <Pressable
                                onPress={handleLogout}
                                disabled={loading}
                                className="bg-black rounded-2xl py-4 items-center active:opacity-80"
                            >
                                <Text className="text-white font-semibold text-sm">
                                    {loading ? "Logging out..." : "Logout"}
                                </Text>
                            </Pressable>
                        </View>

                    )}


                </View>
            </ScrollView>
        </>
    );
}