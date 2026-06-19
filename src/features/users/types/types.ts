export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";

  export type UserProfile = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
  };



