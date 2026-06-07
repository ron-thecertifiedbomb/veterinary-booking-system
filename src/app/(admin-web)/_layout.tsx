import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";
import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { adminNav } from "@/utils/config/sidebar/sidebar";
import { Redirect, Slot } from "expo-router";
import BookingModal from "@/components/booking/BookingModal";
import AddStaffForm from "@/components/common/AddStaffForm/AddStaffForm";
import { AdminFormData, StaffFormData } from "@/features/admin/types/admin.types";
import AddAdminForm from "@/components/common/AddAdminForm/AddAdminForm";
import { useAddAdmin } from "@/features/admin/hooks/useAddAdmin";
import { useAddStaff } from "@/features/staff/hook/useAddStaff";


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

            const payload = {
                email: data.email,
                password: data.password,
                name: data.name,
                phone: data.phone,
                position: data.position,
                specialization: data.specialization,
                licenseNumber: data.licenseNumber,
            };

            addStaff(payload)
            setModalType(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateAdmin = async (data: AdminFormData) => {
        try {
            setSubmitting(true);

            const payload = {
                email: data.email,
                password: data.password,
                name: data.name,
                phone: data.phone,
                position: data.position,
                department: data.department,

            };

            addAdmin(payload)
            setModalType(null);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <SafeAreaView className="flex-1">

            <DashboardShell navItems={adminNav}>

                {/* ✅ ACTION BUTTONS */}
                <View className="flex-row gap-2 justify-end mr-4 lg:mt-4">

                    <Pressable
                        onPress={() => setModalType("staff")}
                        className="bg-black px-4 py-2 rounded-xl"
                    >
                        <Text className="text-white font-semibold">
                            + Staff
                        </Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setModalType("admin")}
                        className="bg-black px-4 py-2 rounded-xl"
                    >
                        <Text className="text-white font-semibold">
                            + Admin
                        </Text>
                    </Pressable>

                </View>

                {/* ✅ PAGE CONTENT */}
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