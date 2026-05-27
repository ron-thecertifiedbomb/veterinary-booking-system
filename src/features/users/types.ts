import { Appointment } from "@/features/appointment/types";

export type GetUserAppointmentsResponse = {
  message: string;
  data: Appointment[];
};


export type User = {
  role: "ADMIN" | "USER";
  // you can add other user properties here for better type safety
} | null;