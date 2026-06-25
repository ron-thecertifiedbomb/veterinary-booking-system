import { adminSchema } from "@/features/admin/schemas/adminSchema";
import { z } from "zod";
import { staffSchema } from "@/features/admin/schemas/staffSchema";
import { Appointment} from "@/features/appointment/types/appointment";
import { StaffProfile } from "@/features/staff/types/staff.types";



export type StaffFormData = z.infer<typeof staffSchema>;
export type AdminFormData = z.infer<typeof adminSchema>;
export type AdminPosition = "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST";


export interface AdminProfile {
  id: string;
  position: AdminPosition;
  department: string;
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

type UnbookedSlot = {
  time: string;
  display: string;
};

type ServerTime = {
  iso: string;
  local: string;
};

export type DashboardMetricsData = {
  todayAppointments: number;
  totalCustomers: number;
  totalStaff: number;
  activeUsers: number;
  activeCustomers: number;
  activeStaff: number;
  totalPets: number;
  todayUnbookedCount: number;
  unbookedSlots: UnbookedSlot[];
};

export type DashboardMetricsResponse = {
  message: string;
  data: DashboardMetricsData;
  serverTime: ServerTime;
};

export interface GetAllAppointmentsResponse {
  message: string;
  data: {
    appointments: Appointment[];
    staffDoctors: StaffDoctor[];
  };
}

export type CreateStaffResponse = {
  message: string;
  data: Staff;
};

export interface Pet {
  id: string;
  petName: string;
  species: string;
  breed: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
  customerId: string;
}



export interface StaffDoctor {
  id: string;
  name: string;
  staffProfile: StaffProfile;
}



export interface Staff {
  id: string;
  name: string;
  staffProfile?: StaffProfile;
}