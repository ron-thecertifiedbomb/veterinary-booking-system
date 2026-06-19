// ..\src\features\auth\types\auth.login.ts

import { UserRole } from "@/features/users/types/types";

export type LoginResponse = {
  message: string;
  data: {
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: UserRole;
      isActive: boolean;
    };
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
