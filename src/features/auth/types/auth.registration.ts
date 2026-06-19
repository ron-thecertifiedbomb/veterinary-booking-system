import { UserRole } from "@/features/users/types/types";


export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

export type RegistrationResponse = {
  message: string;
  data: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};