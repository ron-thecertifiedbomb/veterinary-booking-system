import {
  AuthUser,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/features/auth/types";


export type AuthContextType = {
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  user: AuthUser | null;

  refreshSession: () => Promise<void>;
  setSession: (user: AuthUser, token: string) => Promise<void>;
  updateUser: (updatedUser: Partial<AuthUser>) => Promise<void>;
  logout: () => Promise<any | null>;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
};