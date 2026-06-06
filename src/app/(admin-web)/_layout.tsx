import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable, Text } from "react-native";

import DashboardShell from "@/components/common/Layouts/DashBoardShell/DashBoardShell";
import Loader from "@/components/common/Loader/Loader";


import { useAuth } from "@/features/auth/providers/AuthProvider";
import { adminNav } from "@/utils/config/sidebar/sidebar";

import { Redirect, Slot } from "expo-router";
import BookingModal from "@/components/booking/BookingModal";
import AddStaffForm from "@/components/common/AddStaffForm/AddStaffForm";

export default function AdminWebLayout() {
    const { user, loading, isAuthenticated } = useAuth();

    // ✅ Modal state
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // ✅ loading
    if (loading) {
        return <Loader fullScreen size="large" />;
    }

    // ✅ BLOCK: not authenticated
    if (!isAuthenticated) {
        return <Redirect href="/(auth)/login" />;
    }

    // ✅ safety
    if (!user) return null;

    // ✅ BLOCK: not ADMIN
    if (user.role !== "ADMIN") {
        return <Redirect href="/" />;
    }

    // ✅ handle submit
    const handleCreateStaff = async (data: any) => {
        try {
            setSubmitting(true);

            console.log("Create staff:", data);

            // 👉 connect API here
            // await createStaff(data)

            setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="flex-1">

            <DashboardShell navItems={adminNav}>

                {/* ✅ Top Action Bar (you can move this into header later) */}
                <Pressable
                    onPress={() => setOpen(true)}
                    className="bg-black px-4 py-2 rounded-xl self-end m-4"
                >
                    <Text className="text-white font-semibold">
                        + Add Staff
                    </Text>
                </Pressable>

                {/* ✅ Page Content */}
                <Slot />

            </DashboardShell>

            {/* ✅ GLOBAL MODAL */}
            <BookingModal
                visible={open}
                onClose={() => setOpen(false)}
            >
                <AddStaffForm
                    loading={submitting}
                    onSubmit={handleCreateStaff}
                />
            </BookingModal>

        </SafeAreaView>
    );
}