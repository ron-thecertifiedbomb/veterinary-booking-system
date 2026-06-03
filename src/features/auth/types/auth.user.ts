export interface AuthenticatedUserResponse {
  message: string;
  data: AuthenticatedUser;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  customerProfile: CustomerProfile;
}

export interface CustomerProfile {
  id: string;
  pets: Pet[];
  appointments: Appointment[];
}

export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  weight: number;
}

export interface Appointment {
  id: string;
  bookingCode: string;
  serviceType: string;
  appointmentDate: string;
  status: string;
  pet: AppointmentPet;
  staff: StaffSummary | null;
}

export interface AppointmentPet {
  id: string;
  name: string;
}

export interface StaffSummary {
  id: string;
  name: string;
}
