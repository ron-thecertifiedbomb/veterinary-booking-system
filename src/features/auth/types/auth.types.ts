// src/features/auth/auth.types.ts

import { UserProfile, UserRole } from "@/features/users/types/types";

export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
};

 export type Time = {
  currentTime: {
    iso: string;
    local: string;
  };
 }

export type AuthenticatedUserResponse = {
  message: string;
  data: UserProfile;
  time: Time
};
