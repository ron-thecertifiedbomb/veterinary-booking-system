import AppointmentCard from "@/components/common/Appointments/AppointmentCard";
import Container from "@/components/common/Container/Container";
import EmptyState from "@/components/common/EmptyState/EmptyState";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { router } from "expo-router";
import { useEffect } from "react";
import { FlatList, Platform, View } from "react-native";

export default function Appointments() {
    const { refreshSession, user, loading } = useAuth();

    const appointments = user?.customerProfile?.appointments || [];
    const isEmpty = appointments.length === 0;

    useEffect(() => {
        refreshSession();
    }, []);

    // ✅ FULLSCREEN LOADER (initial load)
    if (loading && appointments.length === 0) {
        return <Loader fullScreen />;
    }

    const handleAddAppointment = () => {
        const isWeb = Platform.OS === "web";
        router.push(isWeb ? "/(web)/web-home" : "/(app)/(tabs)/home");
    };

    return (
        <Container>
            {/* ✅ HEADER */}
            <HeaderSection
                title="My Appointments"
                description="Track your upcoming and past bookings."
            />

            {/* ✅ EMPTY */}
            {isEmpty && !loading ? (
                <EmptyState
                    title="No appointments yet"
                    description="Start by booking your first visit."
                    buttonLabel="Book an Appointment"
                    onPress={handleAddAppointment}
                />
            ) : (
                <View className="flex-1">
                    <FlatList
                        data={appointments}
                        keyExtractor={(item) => item.bookingCode}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 32,
                            paddingTop: 8,
                        }}
                        onRefresh={refreshSession}
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
                        renderItem={({ item }) => (
                            <AppointmentCard item={item} />
                        )}
                    />
                </View>
            )}
        </Container>
    );
}