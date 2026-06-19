// ..\src\features\appointment\types\appointment.ts
import { AdminProfile } from "@/features/admin/types/admin.types";
import { AuthenticatedUserResponse } from "@/features/auth/types/auth.types";
import { CustomerProfile } from "@/features/customer/types/customer.types";
import { Pet } from "@/features/pet/pet.types";
import { StaffProfile } from "@/features/staff/types/staff.types";

export type AppointmentDependencies = {
  setLoading: (value: boolean) => void;
  setSession: (user: AuthenticatedUserResponse, token: string) => Promise<void>;
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

export type CreateAppointmentPayload = {
  petId: string;
  serviceType: ServiceType;
  appointmentDate: string;
  notes: string;
};

export type CreateAppointmentResponse = {
  message: string;
  data: {
    id: string;
    bookingCode: string;
    customer: string;
    pet: string;
    serviceType: ServiceType;
    notes: string;
    status: AppointmentStatus;
    appointmentDisplay: {
      date: string;
      time: string;
    };
    bookedAt: string;
  };
};

export interface Appointment {
  id: string;
  bookingCode: string;
  serviceType: ServiceType;
  appointmentDate: string;
  status: AppointmentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  pet: Pet;
  customer?: CustomerProfile;
  staff?: StaffProfile;
  admin?: AdminProfile 
}


export type AppointmentApiResponse = {
  message: string;
  data: {
    id: string;
    bookingCode: string;
    customer: string;
    pet: string;
    serviceType: ServiceType;
    notes: string;
    status: AppointmentStatus;
    appointmentDisplay: {
      date: string;
      time: string;
    };
    bookedAt: string;
  };
};

export interface ServerTime {
  iso: string;
  local: string;
}

export interface GetMyAppointmentHistoryResponse {
  message: string;
  data: Appointment[];

}