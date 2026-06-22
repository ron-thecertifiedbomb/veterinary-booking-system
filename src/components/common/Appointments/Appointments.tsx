import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect, useState, useRef } from "react"; // Added useRef
import { FlatList, Platform, View, TouchableOpacity, Text } from "react-native";

// Helper to reliably format dates as YYYY-MM-DD in local time
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
    const [activePicker, setActivePicker] = useState<"from" | "to" | null>(null);
  
    const role = user?.role;

    // ✅ NEW: Store the last fetched parameters to prevent duplicate network calls
    const lastFetchedParams = useRef<string | null>(null);

    useEffect(() => {
        if (token && role) {
            // Stringify the dependencies we care about for a deep-equality check
            const currentParams = JSON.stringify({ filters, role, token });

            // Only trigger the API call if the parameters are actually different
            if (lastFetchedParams.current !== currentParams) {
                fetchAppointments({ filters, role });
                lastFetchedParams.current = currentParams; // Update our memory bank
            }
        }
    }, [token, filters, role, fetchAppointments]); 

    const handleTabChange = (tab: TabState) => {
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

    if (loading) {
        return <Loader fullScreen />;
    }

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/home" : "(app)(tabs)/home");
    };

    const handleDateSelection = (selectedDate: string) => {
        if (activePicker === "from") {
            setFilters(prev => ({ ...prev, from: selectedDate }));
        } else if (activePicker === "to") {
            setFilters(prev => ({ ...prev, to: selectedDate }));
        }
        setActivePicker(null); 
    };

    return (
        <Container>
            <HeaderSection title="My Appointments" />

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
            
            {isEmpty && !loading ? (
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
                        // Note: User-initiated pull-to-refresh will still bypass the ref check 
                        // because we are explicitly calling the function here. This is exactly what we want.
                        onRefresh={() => fetchAppointments({ filters, role })}
                        refreshing={loading}
                        ListFooterComponent={
                            loading ? (
                                <View className="py-4">
                                    <Loader />
                                </View>
                            ) : (
                                <View style={{ height: 40 }} />
                            )
                        }
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