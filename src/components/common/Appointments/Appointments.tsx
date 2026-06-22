import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router, useFocusEffect } from "expo-router";
// ✅ Re-added useEffect for the loading sync
import { useCallback, useState, useEffect } from "react"; 
import { FlatList, Platform, View, TouchableOpacity, Text } from "react-native";

const getLocalDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

type TabState = "Previous" | "Today" | "Upcoming";

export default function Appointments() {
    const { token, user } = useAuth(); 
    const { loading, isEmpty, appointments, fetchAppointments, filters, setFilters } = useGetAppointments();
    const [activeTab, setActiveTab] = useState<TabState>("Today");
    
    // ✅ NEW: Track when the user is actively switching tabs
    const [isSwitchingTab, setIsSwitchingTab] = useState(false);
  
    const role = user?.role;

    useFocusEffect(
        useCallback(() => {
            if (token && role) {
                fetchAppointments({ filters, role });
            }
        }, [token, role, filters, fetchAppointments])
    );

    // ✅ NEW: Turn off the switching loader once the hook finishes fetching
    useEffect(() => {
        if (!loading) {
            setIsSwitchingTab(false);
        }
    }, [loading]);

    const handleTabChange = (tab: TabState) => {
        if (activeTab === tab) return; // Prevent unnecessary fetches if clicking the same tab

        setIsSwitchingTab(true); // ✅ Trigger the main loader
        setActiveTab(tab);
        
        const today = new Date();
        let fromStr = "";
        let toStr = "";

        if (tab === "Today") {
            fromStr = getLocalDateString(today);
            toStr = getLocalDateString(today);
        } else if (tab === "Upcoming") {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            fromStr = getLocalDateString(tomorrow);

            const farFuture = new Date(today);
            farFuture.setFullYear(farFuture.getFullYear() + 5);
            toStr = getLocalDateString(farFuture);
        } else if (tab === "Previous") {
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            toStr = getLocalDateString(yesterday);

            const farPast = new Date(today);
            farPast.setFullYear(farPast.getFullYear() - 5);
            fromStr = getLocalDateString(farPast);
        }

        setFilters(prev => ({ ...prev, from: fromStr, to: toStr }));
    };

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/home" : "/(app)/(tabs)/home"); 
    };

    return (
        <Container>
            <HeaderSection title="My Appointments" />

            {/* TAB NAVIGATION */}
            <View className="flex-row items-center justify-between px-4 mb-4 mt-2">
                {(["Previous", "Today", "Upcoming"] as TabState[]).map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => handleTabChange(tab)}
                            className={`flex-1 py-2 mx-1 items-center rounded-full border ${
                                isActive 
                                    ? "bg-black border-black-600" 
                                    : "bg-transparent border-gray-300"
                            }`}
                        >
                            <Text className={`font-medium ${isActive ? "text-white" : "text-gray-600"}`}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            
            {/* CONTENT AREA */}
            
            {/* ✅ FIXED: Now checks if we are switching tabs OR doing the initial load */}
            {isSwitchingTab || (loading && appointments.length === 0) ? (
                <View className="flex-1 justify-center items-center">
                    <Loader />
                </View>
            ) : isEmpty ? (
                <EmptyState
                    title={`No ${activeTab !== "Today" ? activeTab.toLowerCase() : ""} appointments found`}
                    buttonLabel="Book an Appointment"
                    onPress={handleAddAppointment}
                />
            ) : (
                <View className="flex-1">
                    <FlatList
                        data={appointments}
                        keyExtractor={(item) => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 32,
                            paddingTop: 8,
                        }}
                        onRefresh={() => fetchAppointments({ filters, role })}
                        // ✅ Pull-to-refresh will only trigger if we aren't actively switching tabs
                        refreshing={loading && appointments.length > 0 && !isSwitchingTab} 
                        ListFooterComponent={<View style={{ height: 40 }} />} 
                        renderItem={({ item }) => {
                            const webPath = `/appointments/appointment/${item.id}`;
                            const mobilePath = `/(app)/appointment/${item.id}`; 

                            return (
                                <AppointmentCard 
                                    appointments={item} 
                                    routerPath={Platform.OS === 'web' ? webPath : mobilePath} 
                                />
                            );
                        }}
                    />
                </View>
            )}
        </Container>
    );
}