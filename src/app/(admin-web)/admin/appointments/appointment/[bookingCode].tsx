import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAssignStaff } from "@/features/admin/hooks/useAssignStaff";
import { useDeleteAppointment } from "@/features/admin/hooks/useDeleteAppointment";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useStaffOptions } from "@/features/appointment/hooks/useGetStaffOptions";

import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams, useRouter } from "expo-router"; // <-- Added useRouter
import { useEffect, useState } from "react"; 
import { View, Alert, Platform } from "react-native"; 

export default function AdminAppointmentDetailedScreen() {
    const router = useRouter(); // <-- Initialize router
    const { bookingCode } = useLocalSearchParams<{ bookingCode?: string }>();
    const { token, user } = useAuth(); 
    
    // Hooks
    const { loading: loadingApt, singleAppointment, fetchAppointments } = useGetAppointments();
    const { fetchStaffOptions, options, loading: loadingStaff, error: staffError } = useStaffOptions();
    const { assignStaff, loading: loadingAssign, error: assignError } = useAssignStaff();
    const { deleteAppointment, loading: isDeleting } = useDeleteAppointment(); // <-- Initialize Delete Hook
    
    const role = user?.role;
    const [selectedStaffId, setSelectedStaffId] = useState<string>("");

    useEffect(() => {
        if (singleAppointment?.staff?.id) {
            setSelectedStaffId(singleAppointment.staff.id);
        } else if (singleAppointment && !singleAppointment.staff) {
            setSelectedStaffId("");
        }
    }, [singleAppointment]);

    useEffect(() => {
        if (!token || !bookingCode || !role) return;
        fetchAppointments({ bookingCode }); 
    }, [token, bookingCode, role]);

    useEffect(() => {
        if (!token || !bookingCode) return;
        fetchStaffOptions(bookingCode);
    }, [token, bookingCode]);

    useEffect(() => {
        if (assignError) {
            Alert.alert("Assignment Error", assignError);
            setSelectedStaffId(singleAppointment?.staff?.id || ""); 
        }
    }, [assignError, singleAppointment]);

    const handleStaffAssignmentSubmit = async (staffId: string) => {
        if (!bookingCode) return;
        
        const payloadValue = staffId === "" ? null : staffId;
        setSelectedStaffId(staffId);
        
        const success = await assignStaff(bookingCode, payloadValue as any);
        
        if (success) {
            Alert.alert("Success", "Staff member assigned successfully.");
            await fetchAppointments({ bookingCode });
            await fetchStaffOptions(bookingCode);
        }
    };

    // Refactored handle delete to use Native Alert and proper hook logic
    const handleDelete = async (code: string) => {
        if (Platform.OS === 'web') {
            // WEB BEHAVIOR
            const isConfirmed = window.confirm(`Are you sure you want to delete appointment ${code}?`);
            if (isConfirmed) {
                const success = await deleteAppointment(code);
                if (success) router.replace("/admin/appointments");
            }
        } else {
            // MOBILE BEHAVIOR (iOS / Android)
            Alert.alert(
                "Delete Appointment",
                `Are you sure you want to delete appointment ${code}? This cannot be undone.`,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            const success = await deleteAppointment(code);
                            if (success) {
                                Alert.alert("Deleted", "Appointment successfully deleted.");
                                router.replace("/admin/appointments"); 
                            }
                        }
                    }
                ]
            );
        }
    };

    if ((loadingApt && !singleAppointment) || loadingAssign) {
        return <Loader fullScreen />;
    }

    return (
        <Container className="flex-1 max-w-3xl mx-auto w-full px-4">
            <BackButton webRoute="/admin/appointments" className="mb-4 p-1" />
            <AppointmentDetailCard 
                onDeletePress={bookingCode ? () => handleDelete(bookingCode) : undefined}
                isDeleting={isDeleting} // <-- Passes loading state to the button
                appointment={singleAppointment} 
                staffOptions={options}
                loadingStaff={loadingStaff}
                staffError={staffError}
                selectedStaffId={selectedStaffId} 
                onAssignStaff={handleStaffAssignmentSubmit}
            />
        </Container>
    );
}