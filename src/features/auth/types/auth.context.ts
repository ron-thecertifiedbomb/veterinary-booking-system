import { Appointment } from "@/features/appointment/types/appointment";
import { LoginPayload } from "@/features/auth/types/auth.login";
import {
  RegisterPayload,
  RegistrationResponse,
} from "@/features/auth/types/auth.registration";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";
import { LogOutResponse } from "./auth.logout";

export type AuthContextType = {
  token: string | null;
  loading: boolean;

  // ✅ session state
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;

  // ✅ role helpers
  role: string | null;
  isAdmin: boolean;
  isStaff: boolean;
  isCustomer: boolean;

  // ✅ auth actions
  login: (payload: LoginPayload) => Promise<{
    user: AuthenticatedUser;
    message: string;
  }>;
  register: (payload: RegisterPayload) => Promise<RegistrationResponse>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<LogOutResponse>,
};
