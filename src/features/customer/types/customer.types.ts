import { Appointment } from "@/features/appointment/types/appointment";
import { Pet } from "@/features/pet/pet.types";

export interface CustomerProfile {
  id: string;
  pets: Pet[];
  appointments: Appointment[];
}
