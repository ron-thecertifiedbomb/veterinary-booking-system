import { formatDate, getTodayDate } from "@/utils/date";
import { View, Text } from "react-native";
import { useEffect } from "react";
import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import Loader from "@/components/common/Loader/Loader";

export default function Profile() {
    const date = getTodayDate();
    const now = new Date();

    const { fetchUserProfile, profile, loading, error } = useGetUserProfile();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // ✅ Loading
    if (loading) return <Loader fullScreen />;

    // ✅ Error
    if (error) {
        return (
            <View className="flex-1 justify-center items-center px-6">
                <Text className="text-red-500 text-sm">{error}</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-background items-center">
            <View className="w-full max-w-xl flex-1 px-6">

                {/* ✅ HEADER */}
                <View className="pt-24 mb-6">
                    <Text className="text-3xl font-semibold text-text-primary">
                        My Profile
                    </Text>
                    <Text className="text-sm text-text-secondary mt-1">
                        View and manage your account information.
                    </Text>
                </View>

                {/* ✅ DATE CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-4 mb-5">
                    <Text className="text-[11px] uppercase tracking-wide text-text-muted mb-1">
                        Today is
                    </Text>
                    <Text className="text-base font-semibold text-text-primary">
                        {formatDate(date)}
                    </Text>

                    <Text className="text-xs text-text-secondary mt-1">
                        {now.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                </View>

                {/* ✅ PROFILE CARD */}
                <View className="bg-surface border border-border rounded-2xl px-5 py-5">

                    {/* Name */}
                    <View className="mb-4">
                        <Text className="text-[11px] uppercase text-text-muted mb-1">
                            Full Name
                        </Text>
                        <Text className="text-base font-semibold text-text-primary">
                            {profile?.name || "-"}
                        </Text>
                    </View>

                    {/* Email */}
                    <View className="mb-4">
                        <Text className="text-[11px] uppercase text-text-muted mb-1">
                            Email
                        </Text>
                        <Text className="text-sm text-text-primary">
                            {profile?.email || "-"}
                        </Text>
                    </View>

                    {/* Phone */}
                    <View>
                        <Text className="text-[11px] uppercase text-text-muted mb-1">
                            Phone
                        </Text>
                        <Text className="text-sm text-text-primary">
                            {profile?.phone || "Not provided"}
                        </Text>
                    </View>

                </View>

            </View>
        </View>
    );
}
``