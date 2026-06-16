import { Text, Pressable, View, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useRouter } from "expo-router";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { showAlert } from "@/hooks/crossPlatformAlert";
import { useGetUserProfile } from "@/features/users/hook/useGetUserProfile";
import { useEffect } from "react";
import Svg, { Path } from "react-native-svg";

export default function Profile() {
 
    const router = useRouter();
    const {logout} = useAuth();

    // Pulling profile state directly from your feature hook
    const { profile, loading, fetchUserProfile } = useGetUserProfile();

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await logout();
            const message = response.message;
            showAlert("Success", message);
            router.replace("(auth)/login");
        } catch (err: any) {
            showAlert("Error", err.message); 
        }
    };

    // Safely structure variables with fallback defaults during loading phases
    const userData = profile || {
        id: "—",
        email: "—",
        name: "Awaiting Data",
        phone: "—",
        role: "STAFF",
        isActive: false,
        createdAt: new Date().toISOString(),
        staffProfile: null,
    };

    const staff = userData.staffProfile;

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView 
                className="flex-1 px-6 pt-6"
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchUserProfile} tintColor="#18181B" />
                }
            >
                {/* ─── HEADER ACCOUNT BLOCK ─── */}
                <View className="flex-row items-center justify-between pb-6 border-b border-zinc-100 mb-6">
                    <View className="flex-1 mr-4">
                        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
                            {staff?.position || userData.role}
                        </Text>
                        <Text className="text-2xl font-black tracking-tighter text-black uppercase">
                            {userData.name}
                        </Text>
                    </View>
                    
                    {/* Status Pill Badge */}
                    <View className={`px-3 py-1 border rounded-full ${userData.isActive ? 'bg-black border-black' : 'border-zinc-200'}`}>
                        <Text className={`text-[9px] font-black tracking-widest uppercase ${userData.isActive ? 'text-white' : 'text-zinc-400'}`}>
                            {userData.isActive ? "ACTIVE" : "OFFLINE"}
                        </Text>
                    </View>
                </View>

                {/* ─── CLINICAL PROFILE CREDENTIALS ─── */}
                {staff && (
                    <View className="mb-6">
                        <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">
                            Clinical Credentials
                        </Text>
                        
                        <View className="border border-zinc-100 rounded-3xl p-5 flex-row justify-between items-center bg-white">
                            <View className="flex-1">
                                <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
                                    Specialization
                                </Text>
                                <Text className="text-sm font-bold text-black uppercase">
                                    {staff.specialization}
                                </Text>
                            </View>
                            <View className="w-[1px] h-8 bg-zinc-100 mx-4" />
                            <View className="flex-1">
                                <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-1">
                                    License ID
                                </Text>
                                <Text className="text-sm font-mono font-bold text-zinc-800 uppercase">
                                    {staff.licenseNumber}
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* ─── CONTACT INFORMATION ─── */}
                <View className="mb-6">
                    <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">
                        Contact Information
                    </Text>
                    
                    <View className="border border-zinc-100 rounded-3xl p-5 bg-white">
                        {/* Email row configuration */}
                        <View className="flex-row items-center justify-between pb-4 border-b border-zinc-100">
                            <View>
                                <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-0.5">
                                    Corporate Email
                                </Text>
                                <Text className="text-xs font-medium text-zinc-800">
                                    {userData.email}
                                </Text>
                            </View>
                            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5">
                                <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <Path d="M22 6l-10 7L2 6" />
                            </Svg>
                        </View>

                        {/* Mobile phone configuration row */}
                        <View className="flex-row items-center justify-between pt-4">
                            <View>
                                <Text className="text-[8px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-0.5">
                                    Mobile Number
                                </Text>
                                <Text className="text-xs font-medium text-zinc-800">
                                    {userData.phone}
                                </Text>
                            </View>
                            <Svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A1A1AA" strokeWidth="2.5">
                                <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                            </Svg>
                        </View>
                    </View>
                </View>

                {/* ─── SYSTEM IDENTITY REGISTRY ─── */}
                <View className="mb-8">
                    <Text className="text-[9px] font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">
                        System Registry
                    </Text>
                    <View className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-[8px] font-black tracking-[0.1em] uppercase text-zinc-400">Account Registry ID</Text>
                            <Text className="text-[9px] font-mono text-zinc-500 select-all" numberOfLines={1}>{userData.id}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-[8px] font-black tracking-[0.1em] uppercase text-zinc-400">Joined Database</Text>
                            <Text className="text-[9px] font-mono text-zinc-500">
                                {userData.createdAt !== "—" ? new Date(userData.createdAt).toLocaleDateString() : "—"}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ─── LOGOUT DISCONNECT ACTION BUTTON ─── */}
                <Pressable
                    onPress={handleLogout}
                    disabled={loading}
                    className="w-full bg-black py-4 rounded-full items-center mb-12 active:opacity-80 disabled:opacity-50"
                >
                    <Text className="text-white text-xs font-black tracking-[0.2em] uppercase">
                        {loading ? "loading..." : "Logout"}
                    </Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
}
