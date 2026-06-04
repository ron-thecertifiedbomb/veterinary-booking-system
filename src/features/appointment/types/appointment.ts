// ..\src\features\appointment\types\appointment.ts

import { AuthUser } from "@/features/auth/types/auth.types";

export type AppointmentDependencies = {
  setLoading: (value: boolean) => void;
  setSession: (user: AuthUser, token: string) => Promise<void>;
};

export type ServiceType =
  | "CHECKUP"
  | "VACCINATION"
  | "SURGERY"
  | "GROOMING"
  | string;

export type AppointmentStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | string;


export interface CreateAppointmentResponse {
  message: string;
  data: Appointment;
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
}

export interface CreateAppointmentPayload {
    petId: string;
    serviceType: ServiceType;
    appointmentDate: string; // ISO 8601 date-time
    notes: string;
}