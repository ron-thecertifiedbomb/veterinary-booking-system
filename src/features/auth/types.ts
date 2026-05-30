// src/features/auth/types.ts

import { Pet } from "@/features/pet/types";

export type UserRole = "USER" | "ADMIN";

export type AuthUser = {
  id?: string; // ✅ from backend
  userId?: string; // ✅ normalized version
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  pets: Pet[];
};

export type LoginPayload = {
  email: string;
  password: string;
};


export type LoginResponse = {
  message: string;
  data: {
    access_token: string;
    user: AuthUser;
  };
};


export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone?: string;
};

export type RegisterResponse = {
  message: string;
  data: AuthUser;
};


