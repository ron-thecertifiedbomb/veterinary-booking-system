// ..\src\components\booking\types.ts

import { Pet } from "@/features/pet/pet.types";
import { Slot } from "@/hooks/appointments/useBookingSystem";

export type BookingModalProps = {
  visible: boolean;
  pets: Pet[];
  slots: Slot[];
  creating: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (data: {
    petId: string;
    petName: string;
    serviceType: string;
    time: string;
    notes?: string;
  }) => Promise<void> | void;
  date: string;
  timeDisplay: string;
};
