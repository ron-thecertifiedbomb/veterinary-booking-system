import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Platform, Text, TouchableOpacity, View } from "react-native";

export default function Appointments() {
    // FIX 1: Extract 'user' context so the frontend knows the active user's permissions layout
    const { token, user } = useAuth(); 
    const { loading, appointments, fetchAppointments, filters, setFilters } = useGetAppointments();
    
    // Track localized active states independently on the screen view layer
    const [isTodayOnly, setIsTodayOnly] = useState(false);

    // Derived empty state check to ensure precise rendering
    const isEmpty = appointments.length === 0;
    const role = user?.role;

    console.log('Rendering appointments list with length:', appointments.length);

    useEffect(() => {
        // FIX 2: Only fetch if both token and user role metadata profiles have mounted completely
        if (token && role) {
            // FIX 3: Inject the role prop directly to force your endpoint to target the correct user database segment
            fetchAppointments({ filters, role }); 
        }
    }, [token, filters, role, fetchAppointments]);

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/web-home" : "/home");
    };

    // Helper that generates a clean formatted 'YYYY-MM-DD' text string for any date object
    const formatDateString = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const toggleTodayFilter = () => {
        if (isTodayOnly) {
            setIsTodayOnly(false);
            setFilters(prev => ({
                ...prev,
                from: undefined,
                to: undefined,
            }));
        } else {
            const today = new Date();
            
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);
            
            const tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);

            setIsTodayOnly(true);
            setFilters(prev => ({
                ...prev,
                from: formatDateString(yesterday),   // Opens window to catch timezone boundary overlaps
                to: formatDateString(tomorrow),     // Closes window safely tomorrow night
                sortBy: "appointmentDate",
                sortOrder: "desc"
            }));
        }
    };

    const toggleSortBy = () => {
        setFilters(prev => ({
            ...prev,
            sortBy: prev.sortBy === "appointmentDate" ? "status" : "appointmentDate",
            sortOrder: "desc" 
        }));
    };

    const toggleSortOrder = () => {
        setFilters(prev => ({
            ...prev,
            sortOrder: prev.sortOrder === "asc" ? "desc" : "asc"
        }));
    };

    const currentSortBy = filters.sortBy || "appointmentDate";
    const currentSortOrder = filters.sortOrder || "desc";

    return (
        <Container>
            <HeaderSection title="My Appointments" />
            
            {isEmpty && !loading ? (
                <EmptyState
                    title="No Appointments found"
                    buttonLabel="Book an Appointment"
                    onPress={handleAddAppointment}
                />
            ) : (
                <View className="flex-1">
                    {/* Filter & Sorting Action Header Bar */}
                    <View className="flex-row justify-between items-center px-4 py-2 border-b border-zinc-100 dark:border-zinc-800">
                        <TouchableOpacity 
                            onPress={toggleTodayFilter}
                            className={`flex-row items-center px-3 py-1.5 rounded-full ${
                                isTodayOnly 
                                    ? "bg-black dark:bg-white" 
                                    : "bg-zinc-100 dark:bg-zinc-800"
                            }`}
                        >
                            <Text className={`text-xs font-bold uppercase tracking-wider ${
                                isTodayOnly 
                                    ? "text-white dark:text-black" 
                                    : "text-zinc-800 dark:text-zinc-200"
                            }`}>
                                Today Only
                            </Text>
                        </TouchableOpacity>
                        
                        <View className="flex-row items-center">
                            <TouchableOpacity 
                                onPress={toggleSortBy}
                                className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full mr-2"
                            >
                                <Text className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                                    By: {currentSortBy === "appointmentDate" ? "Date" : "Status"}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                onPress={toggleSortOrder}
                                className="flex-row items-center bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full"
                            >
                                <Text className="text-xs font-bold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider mr-1">
                                    {currentSortOrder === "asc" ? "Asc" : "Desc"}
                                </Text>
                                <Ionicons 
                                    name={currentSortOrder === "asc" ? "arrow-up" : "arrow-down"} 
                                    size={14} 
                                    color={Platform.OS === 'ios' ? '#000000' : '#444444'} 
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loading && appointments.length === 0 ? (
                        <Loader fullScreen />
                    ) : (
                        <FlatList
                            data={appointments}
                            keyExtractor={(item) => item.id}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                paddingBottom: 32,
                                paddingTop: 8,
                            }}
                            // FIX 4: Add explicit role mapping variables onto pull-to-refresh indicators
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
                                const mobilePath = `/appointment/${item.id}`; 

                                return (
                                    <AppointmentCard 
                                        appointments={item} 
                                        routerPath={Platform.OS === 'web' ? webPath : mobilePath} 
                                    />
                                );
                            }}
                        />
                    )}
                </View>
            )}
        </Container>
    );
}
