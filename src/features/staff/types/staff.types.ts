import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { StaffPosition } from "@/features/auth/types/auth.user";

export interface GetAllStaffResponse {
  message: string;
  data: AuthenticatedUser[];
}

export interface StaffProfile {
  specialization: string;
  position: StaffPosition;
  licenseNumber: string;
}
