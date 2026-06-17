import { AdminProfile } from "@/features/admin/types/admin.types";
import { Appointment } from "@/features/appointment/types/appointment";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { UserRole } from "@/features/auth/types/auth.user";
import { Pet } from "@/features/pet/pet.types";
import { StaffProfile } from "@/features/staff/types/staff.types";

export interface CustomerProfile {
  id: string;
  pets: Pet[];
  appointments: Appointment[];
}

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

export type UpdateCustomerProfileResponse = {
  message: string;
  data: userProfile;
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