import { Appointment } from "@/features/appointment/types";

export type GetUserAppointmentsResponse = {
  message: string;
  data: Appointment[];
};


export type User = {
  role: "ADMIN" | "USER";
  // you can add other user properties here for better type safety
} | null;



// ✅ Define your user type (adjust if needed)
export type UserProfile = {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
};

export type GetUserProfileResponse = {
  data: UserProfile;
  message?: string;
};
