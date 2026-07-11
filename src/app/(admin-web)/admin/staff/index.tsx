import AdminUsersList from "@/components/admin/AdminUsersList";
import { useAllGetStaff } from "@/features/admin/hooks/useGetAllStaff";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useEffect } from "react";

function formatPosition(position?: string) {
  if (!position) return "Staff";
  return position
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function staffSubtitle(user: AuthenticatedUser) {
  return formatPosition(user.staffProfile?.position);
}

export default function StaffScreen() {
  const { fetchAllStaff, allStaff, loading } = useAllGetStaff();

  useEffect(() => {
    fetchAllStaff();
  }, []);

  return (
    <AdminUsersList
      title="Staff"
      lead="Clinic staff accounts and credentials."
      users={allStaff}
      loading={loading}
      onRefresh={fetchAllStaff}
      emptyTitle="No staff yet"
      emptyDescription="Use Add staff in the admin header to create team members."
      getSubtitle={staffSubtitle}
      getMeta={(user) => [
        {
          label: "Specialization",
          value: user.staffProfile?.specialization || "General practice",
        },
        {
          label: "License",
          value: user.staffProfile?.licenseNumber || "—",
        },
      ]}
    />
  );
}
