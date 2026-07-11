import BookingModal from "@/components/booking/BookingModal";
import AddAdminForm from "@/components/common/AddAdminForm/AddAdminForm";
import AddStaffForm from "@/components/common/AddStaffForm/AddStaffForm";
import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader";
import { useAddAdmin } from "@/features/admin/hooks/useAddAdmin";
import { useAddStaff } from "@/features/admin/hooks/useAddStaff";
import { AdminFormData, StaffFormData } from "@/features/admin/types/admin.types";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { adminNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import { useState } from "react";
import TopBar from "@/components/layout/TopBar";
import AppButton from "@/components/ui/AppButton";
import { showAlert } from "@/hooks/crossPlatformAlert";


import { SafeAreaView } from "react-native-safe-area-context";

type ModalType = "staff" | "admin" | null;

export default function AdminWebLayout() {
    
    const { user, loading, isAuthenticated } = useAuth();
    
        const { addAdmin, loading: adminLoading } = useAddAdmin();
        const { addStaff, loading: staffLoading } = useAddStaff();

    const [modalType, setModalType] = useState<ModalType>(null);
    const [submitting, setSubmitting] = useState(false);

    /* ---------------- GUARDS ---------------- */

    if (loading) return <Loader fullScreen />;

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ BLOCK: not ADMIN
    if (user?.role !== "ADMIN") {
        return <Redirect href="/(auth)/login" />;
    }
    /* ---------------- HOOKS ---------------- */


    const isSubmitting = adminLoading || staffLoading;

    /* ---------------- HANDLERS ---------------- */

    const handleCreateStaff = async (data: StaffFormData) => {
        try {
            setSubmitting(true);

            const response = await addStaff({
                email: data.email,
                password: data.password,
                name: data.name,
                phone: data.phone,
                position: data.position,
                specialization: data.specialization,
                licenseNumber: data.licenseNumber,
            });

            if (!response) {
                showAlert("Error", "Failed to create staff member");
                return;
            }

            showAlert("Success", response.message);
            setModalType(null);
        } catch (err: any) {
            showAlert("Error", err?.message || "Failed to create staff member");
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateAdmin = async (data: AdminFormData) => {
        try {
            setSubmitting(true);

            const response = await addAdmin({
                email: data.email,
                password: data.password,
                name: data.name,
                phone: data.phone,
                position: data.position,
                department: data.department,
            });

            if (!response) {
                showAlert("Error", "Failed to create admin");
                return;
            }

            showAlert("Success", response.message);
            setModalType(null);
        } catch (err: any) {
            showAlert("Error", err?.message || "Failed to create admin");
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <SafeAreaView className="flex-1">

            <DashboardShell navItems={adminNav}>
                <TopBar
                    title="Admin"
                    description="Manage staff, customers, and clinic operations."
                    actions={
                        <>
                            <AppButton
                                label="Add staff"
                                onPress={() => setModalType("staff")}
                                fullWidth={false}
                                size="sm"
                            />
                            <AppButton
                                label="Add admin"
                                variant="outline"
                                onPress={() => setModalType("admin")}
                                fullWidth={false}
                                size="sm"
                            />
                        </>
                    }
                />

                <Slot />

            </DashboardShell>

            {/* ✅ GLOBAL MODAL */}
         { isSubmitting && <Loader fullScreen />}
           <BookingModal
                key={modalType} // ✅ reset form each open
                visible={modalType !== null}
                onClose={() => setModalType(null)}
            >
                {modalType === "staff" && (
                    <AddStaffForm
                        loading={submitting}
                        onSubmit={handleCreateStaff}
                    />
                )}

                {modalType === "admin" && (
                    <AddAdminForm
                        loading={submitting}
                        onSubmit={handleCreateAdmin}
                    />
                )}
            </BookingModal>

        </SafeAreaView>
    );
}