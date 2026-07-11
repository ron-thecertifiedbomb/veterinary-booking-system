import AdminUsersList from "@/components/admin/AdminUsersList";
import { useGetAllCustomers } from "@/features/admin/hooks/useGetAllCustomers";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { useEffect } from "react";

function customerSubtitle(user: AuthenticatedUser) {
  const petCount = user.customerProfile?.pets?.length ?? 0;
  return petCount === 1 ? "1 registered pet" : `${petCount} registered pets`;
}

export default function CustomersScreen() {
  const { fetchAllCustomers, allCustomers, loading } = useGetAllCustomers();

  useEffect(() => {
    fetchAllCustomers();
  }, []);

  return (
    <AdminUsersList
      title="Customers"
      lead="Registered pet owners and their clinic accounts."
      users={allCustomers}
      loading={loading}
      onRefresh={fetchAllCustomers}
      emptyTitle="No customers yet"
      emptyDescription="Customer accounts will appear here after registration."
      getSubtitle={customerSubtitle}
      getMeta={(user) => [
        {
          label: "Customer ID",
          value: user.customerProfile?.id?.slice(0, 8) ?? user.id.slice(0, 8),
        },
      ]}
    />
  );
}
