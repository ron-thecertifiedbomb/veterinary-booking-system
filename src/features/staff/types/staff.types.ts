import { Customer, User } from "@/features/admin/types/admin.types";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";

export type StaffPosition = "VETERINARIAN" | "VET_TECHNICIAN" | "GROOMER";

export interface GetAllStaffResponse {
  message: string;
  data: AuthenticatedUser[];
}

export interface StaffProfile {
  specialization: string;
  position: StaffPosition;
  licenseNumber: string;
}

export type CreateStaffResponse = {
  message: string;
  data: Staff;
};

export type Staff = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  staffProfile: StaffProfile;
};


export type DashboardStatsResponse = {
  message: string;
  data: {
      totalAssigned: number;
      completed: number;
      inProgress: number;
      upcoming: number;
  };
};

export type AssignedPatient = {
  id: string;
  petName: string;
  species: string;
  breed: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  customer: Customer;
  appointmentIds: string[];
};


export type ISODateString = string;

export type AssignedPatientsResponse = {
    message: string;
    data:AssignedPatient[];
};