// src/features/auth/auth.types.ts


import { UserRole } from "@/features/auth/types/auth.user";
import { CustomerProfile } from "@/features/customer/types/customer.types";
import { Pet } from "@/features/pet/pet.types";
import { StaffProfile } from "@/features/staff/types/staff.types";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customerProfile?: CustomerProfile; // only if CUSTOMER
  staffProfile?: StaffProfile;
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
    customerProfile?: CustomerProfile; // only if CUSTOMER
    staffProfile?: StaffProfile;
  };
};
