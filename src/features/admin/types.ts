// ✅ TYPES (recommended)
export type Appointment = {
  id: number;
  ownerName: string;
  petName: string;
  serviceType: string;
  appointmentDate: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
};
