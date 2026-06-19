// ..\src\features\auth\types\auth.login.ts

import { UserProfile, UserRole } from "@/features/users/types/types";

export type LoginResponse = {
  message: string;
  data: {
    access_token: string;
    user: UserProfile
    serverTime: {
      iso: string;
      local: string;
    };
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};
