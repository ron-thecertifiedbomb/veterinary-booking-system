import { AdminProfile } from "@/features/admin/types/admin.types";
import { UserRole } from "@/features/auth/types/auth.user";
import { CustomerProfile } from "@/features/customer/types/customer.types";
import { StaffProfile } from "@/features/staff/types/staff.types";

export type userProfile = {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    customerProfile?: CustomerProfile; 
    staffProfile?: StaffProfile;
    adminProfile?: AdminProfile
  };