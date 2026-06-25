import { AdminProfile } from "@/features/admin/types/admin.types";
import { CustomerProfile } from "@/features/customer/types/customer.types";
import { StaffProfile } from "@/features/staff/types/staff.types";

export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";

export interface UserProfile {
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
}
  export type GetAllUsersResponse = {
    message: string;
    users: UserProfile[];
  };
  export type GetUserResponse = {
    message: string;
    data: UserProfile;
  };
  export type UpdateUserProfileResponse = {
    message: string;
    data: UserProfile;
  };
  
  export type UpdateUserProfilePayload = {
    name: string;
    phone: string;
  };
  