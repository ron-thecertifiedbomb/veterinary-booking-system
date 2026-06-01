import { AuthUser } from "@/features/auth/types";

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
}

export type AppointmentDependencies = {
  setLoading: (value: boolean) => void;
  setSession: (user: AuthUser, token: string) => Promise<void>;
};

export type CreateAppointmentPayload = {
  userId: string;
  petId: string;
  serviceType: string;
  appointmentDate: string;
  notes: string;
};

export type CreateAppointmentResponse= {
  message: string;
  data: CreateAppointmentPayload;
};

export type CreateAppointmentInput = {
  petId: string;
  petName: string;
  serviceType: string;
  date: string;
  time: string;
  notes?: string;
};