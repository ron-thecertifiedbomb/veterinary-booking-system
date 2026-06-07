
import { adminSchema } from "@/features/admin/schemas/adminSchema";
import { z } from "zod";

import { staffSchema } from "@/features/admin/schemas/staffSchema";




export type StaffFormData = z.infer<typeof staffSchema>;

export type AdminFormData = z.infer<typeof adminSchema>;

export type AdminPosition = "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST";




export interface AdminProfile {
  specialization: string;
  position: AdminPosition;
  licenseNumber: string;
}


export type CreateAdminResponse = {
  message: string;
  data: Admin;
};

export type Admin = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  adminProfile: AdminProfile;
};
