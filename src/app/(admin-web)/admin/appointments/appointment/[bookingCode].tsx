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
    // 1. Grab all parameters. If the folder uses [id].tsx, Expo Router stores the booking code inside the 'id' key.
    const params = useLocalSearchParams<Record<string, string>>();
    const bookingCode = params.bookingCode || params.id; 
    
    const { token } = useAuth(); 
    const { loading: loadingApt, singleAppointment, fetchAppointments } = useGetAppointments();
    const { fetchStaffOptions, options, loading: loadingStaff, error: staffError } = useStaffOptions();
    const { assignStaff, loading: loadingAssign, error: assignError } = useAssignStaff();
    
    const [selectedStaffId, setSelectedStaffId] = useState<string>("");

    console.log("Resolved dynamic screen route parameter:", bookingCode);

    // Sync dropdown selection layout with backend state changes
    useEffect(() => {
        if (singleAppointment?.staff?.id) {
            setSelectedStaffId(singleAppointment.staff.id);
        } else if (singleAppointment && !singleAppointment.staff) {
            setSelectedStaffId("");
        }
    }, [singleAppointment]);

    // Simple Hook Trigger: Bypasses filters and loads using whichever key held your parameter value
    useEffect(() => {
        if (!token || !bookingCode) return;
        
        fetchAppointments({ bookingCode, filters: undefined }); 
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
            await fetchAppointments({ bookingCode, filters: undefined });
            await fetchStaffOptions(bookingCode);
        }
    };

    if (loadingApt && !singleAppointment) {
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
