// src/features/auth/auth.types.ts

import { Appointment } from "@/features/appointment/types/appointment";
import { StaffPosition, UserRole } from "@/features/auth/types/auth.user";
import { PetProfile } from "@/features/pet/pet.types";


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

export interface CustomerProfile {
  id: string;
  pets: PetProfile[];
  appointments: Appointment[];
}

export type StaffProfile = {
  id: string;
  specialization: string;
  licenseNumber: string;
  position: StaffPosition;
  userId: string;
};

// export type AuthenticatedStaffResponse = {
//   message: string;
//   data: {
//     id: string;
//     email: string;
//     name: string;
//     phone: string;
//     role: UserRole;
//     isActive: boolean;
//     createdAt: string;
//     updatedAt: string;
//     staffProfile: StaffProfile;
//   };
// };
