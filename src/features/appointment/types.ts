import { AuthUser } from "@/features/auth/types/auth.types";
import { Pet } from "@/features/pet/types";

export type Slot = {
  time: string;
  available: boolean;
  status: "available" | "full" | "past";
};

export type SlotsResponse = {
  meta: {
    currentDateTime: {
      iso: string;
      date: string;
      time: string;
    };
    timezone: string;
    date: string;
  };
  slots: Slot[];
};

export type SlotsApiResponse = {
  message: string;
  data: SlotsResponse;
};

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

export interface AppointmentData {
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
}

export interface CreateAppointmentResponse {
  message: string;
  data: AppointmentData[];
}

export interface CreateAppointmentInput {
  petId: string;
  serviceType: ServiceType;
  appointmentDate: string;
  notes: string;
}