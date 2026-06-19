// src/features/auth/auth.types.ts


import { AdminProfile } from "@/features/admin/types/admin.types";
import { CustomerProfile } from "@/features/customer/types/customer.types";
import { StaffProfile } from "@/features/staff/types/staff.types";
import { UserRole } from "@/features/users/types/types";

export type AuthenticatedUser = {
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
  adminProfile: AdminProfile;
};



export type AuthenticatedUserResponse = {
  message: string;
  data: {
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
    adminProfile: AdminProfile;
  };
};
