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
