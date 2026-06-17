
import { adminSchema } from "@/features/admin/schemas/adminSchema";
import { z } from "zod";

import { staffSchema } from "@/features/admin/schemas/staffSchema";
import { AppointmentStatus, ServiceType } from "@/features/appointment/types/appointment";




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



export type DashboardMetricsResponse = {
  message: string;
  data: DashboardMetrics;
  serverTime: ServerTime;
};

export type DashboardMetrics = {
  todayAppointments: number;
  totalCustomers: number;
  totalStaff: number;
  activeUsers: number;
  activeCustomers: number;
  activeStaff: number;
  totalPets: number;
};

export type ServerTime = {
  iso: string;
  local: string;
};



export interface GetAllAppointmentsResponse {
  message: string;
  data: {
    appointments: Appointment[];
    staffDoctors: StaffDoctor[];
  };
}

export interface Appointment {
  id: string;
  bookingCode: string;
  serviceType: ServiceType;
  appointmentDate: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  petId: string;
  staffId: string | null;
  pet: Pet;
  customer: Customer;
  staff: Staff | null;
}

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

export interface Customer {
  id: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface StaffDoctor {
  id: string;
  name: string;
  staffProfile: StaffProfile;
}

export interface StaffProfile {
  id: string;
  position: 'VETERINARIAN' | string;
  specialization: string;
}

export interface Staff {
  id: string;
  name: string;
  staffProfile?: StaffProfile;
}