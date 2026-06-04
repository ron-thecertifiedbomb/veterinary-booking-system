// ..\src\features\auth\types\auth.login.ts

export interface LoginResponse {
  message: string;
  data: LoginData;
}

export interface LoginData {
  access_token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: "CUSTOMER";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  customerProfile: CustomerProfile;
  staffProfile: StaffProfile | null;
  adminProfile: AdminProfile | null;
  serverTime: ServerTime;
}

export interface CustomerProfile {
  id: string;
}

export interface StaffProfile {
  id: string;
}

export interface AdminProfile {
  id: string;
}

export interface ServerTime {
  iso: string;
  display: string;
}
