// ..\src\features\appointment\types\appointment.ts
import { AuthenticatedUserResponse } from "@/features/auth/types/auth.types";
import { Pet } from "@/features/pet/pet.types";
import { Staff } from "@/features/staff/types/staff.types";

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
  notes: string | null;
  createdAt: string;
  pet: Pet;
  staff: Staff | null;
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
  serverTime: ServerTime;
}