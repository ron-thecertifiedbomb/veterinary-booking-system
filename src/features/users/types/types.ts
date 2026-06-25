export type UserRole = "CUSTOMER" | "ADMIN" | "STAFF";

  export type UserProfile = {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    isActive: boolean;
  };

  export type GetAllUsersResponse = {
    message: string;
    users: UserProfile[];
  };
  

  export type UpdateUserProfileResponse = {
    message: string;
    data: UserProfile;
  };
  
  
  export type UpdateUserProfilePayload = {
    name: string;
    phone: string;
  };
  