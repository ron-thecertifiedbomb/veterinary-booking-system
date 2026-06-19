import { AppointmentDetailCard } from "@/components/common/Appointments/AppointmentDetailedCard";
import { BackButton } from "@/components/common/BackButton/BackButton";
import Container from "@/components/common/Container/Container";
import HeaderSection from "@/components/common/HeaderSection/HeaderSection";
import Loader from "@/components/common/Loader/Loader";
import { useAssignStaff } from "@/features/admin/hooks/useAssignStaff";
import { useGetAppointments } from "@/features/appointment/hooks/useGetAppointments";
import { useStaffOptions } from "@/features/appointment/hooks/useGetStaffOptions";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useLocalSearchParams } from "expo-router"; 
import { useEffect, useState } from "react"; 
import { View, Alert } from "react-native"; // Imported Alert

export default function AdminAppointmentDetailedScreen() {
    const { token, user } = useAuth(); 
    const { loading: loadingApt, singleAppointment, fetchAppointments } = useGetAppointments();
    const { fetchStaffOptions, options, loading: loadingStaff, error: staffError } = useStaffOptions();
    
    // Inject mutation hooks engine layer
    const { assignStaff, loading: loadingAssign, error: assignError } = useAssignStaff();
    
    const { bookingCode } = useLocalSearchParams<{ bookingCode?: string }>();
    const role = user?.role;
    const [selectedStaffId, setSelectedStaffId] = useState<string>("");

    const hasStaff = !!singleAppointment?.staff;
    const isUnassigned = singleAppointment !== null && !hasStaff;

    useEffect(() => {
        if (!token || !role || !bookingCode) return;
        fetchAppointments({ bookingCode }); 
    }, [token, bookingCode, role]);

    useEffect(() => {
        if (!token || !bookingCode || !isUnassigned) return;
        fetchStaffOptions(bookingCode);
    }, [token, bookingCode, isUnassigned]);

    // Handle background errors and project them to the user via Alert notifications
    useEffect(() => {
        if (assignError) {
            Alert.alert("Assignment Error", assignError);
            setSelectedStaffId(""); // Reset the selected state on failure so the selector text drops back
        }
    }, [assignError]);

    const handleStaffAssignmentSubmit = async (staffId: string) => {
        if (!bookingCode || !staffId) return;
        setSelectedStaffId(staffId);

        // Execute network mutation block call
        const success = await assignStaff(bookingCode, staffId);
        
        if (success) {
            Alert.alert("Success", "Staff member assigned successfully.");
            fetchAppointments({ bookingCode });
        }
    };

    // Show Fullscreen Loader if app is pulling appointment metadata OR actively mutation saving a doctor
    if ((loadingApt && !singleAppointment) || loadingAssign) {
        return <Loader fullScreen />;
    }

    return (
        <Container className="flex-1 max-w-3xl mx-auto w-full px-4">
            <BackButton webRoute="/admin/appointments" className="mb-4 p-1" />
            
            <AppointmentDetailCard 
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
