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
  data: Appointment[]
};

export interface ServerTime {
  iso: string;
  local: string;
}

export interface GetMyAppointmentHistoryResponse {
  message: string;
  data: Appointment[];

}

// Add these declarations into your slots type folder definitions block
export interface StaffDropdownItem {
  value: string;         // Maps directly to the target User ID
  label: string;         // Pre-formatted as: "Dr. Name (Specialization)"
  profileId: string | null;
  position: string | null;
  specialization: string | null;
  isAvailable: boolean;  // Always true because busy records are filtered out on the backend
}
