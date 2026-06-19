import { AdminProfile } from "@/features/admin/types/admin.types";
import { Appointment } from "@/features/appointment/types/appointment";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";

import { Pet } from "@/features/pet/pet.types";
import { StaffProfile } from "@/features/staff/types/staff.types";
import { UserProfile, UserRole } from "@/features/users/types/types";

export interface CustomerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
}


export type UpdateCustomerProfileResponse = {
  message: string;
  data: UserProfile;
};


export type updateCustomerProfilePayload = {
  name: string;
  phone: string;
};


export type fetchCustomerProfileResponse = {
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
    adminProfile?: AdminProfile
  };
  
};

export interface GetAllCustomerResponse {
  message: string;
  data: AuthenticatedUser[];
}