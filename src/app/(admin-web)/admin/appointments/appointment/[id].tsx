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
import { View, Alert } from "react-native"; 

export default function AdminAppointmentDetailedScreen() {
    // 1. Extract appointmentId instead of bookingCode
    const { appointmentId } = useLocalSearchParams<{ appointmentId?: string }>();
    const { token, user } = useAuth(); 
    const { loading: loadingApt, singleAppointment, fetchAppointments } = useGetAppointments();
    const { fetchStaffOptions, options, loading: loadingStaff, error: staffError } = useStaffOptions();
    const { assignStaff, loading: loadingAssign, error: assignError } = useAssignStaff();
    
    const role = user?.role;
    console.log('appointment ID', appointmentId)
    const [selectedStaffId, setSelectedStaffId] = useState<string>("");

    // Sync local selection state immediately whenever the data changes from the network background thread
    useEffect(() => {
        if (singleAppointment?.staff?.id) {
            setSelectedStaffId(singleAppointment.staff.id);
        } else if (singleAppointment && !singleAppointment.staff) {
            setSelectedStaffId("");
        }
    }, [singleAppointment]);

    // 2. Update guards, fetch payload, and dependency arrays
    useEffect(() => {
        if (!token || !appointmentId || !role) return;
        fetchAppointments({ appointmentId }); 
    }, [token, appointmentId, role]);

    useEffect(() => {
        if (!token || !appointmentId) return;
        fetchStaffOptions(appointmentId);
    }, [token, appointmentId]);

    useEffect(() => {
        if (assignError) {
            Alert.alert("Assignment Error", assignError);
            setSelectedStaffId(singleAppointment?.staff?.id || ""); 
        }
    }, [assignError, singleAppointment]);

    const handleStaffAssignmentSubmit = async (staffId: string) => {
        // 3. Update assignment logic to use appointmentId
        if (!appointmentId) return;
        
        const payloadValue = staffId === "" ? null : staffId;
        setSelectedStaffId(staffId);
        
        const success = await assignStaff(appointmentId, payloadValue as any);
        
        if (success) {
            Alert.alert("Success", "Staff member assigned successfully.");
            await fetchAppointments({ appointmentId });
            await fetchStaffOptions(appointmentId);
        }
    };

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