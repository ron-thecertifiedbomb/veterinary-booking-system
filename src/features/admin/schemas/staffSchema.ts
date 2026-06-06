import { z } from "zod";

export const staffSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  phone: z.string().min(10),
  position: z.enum(["VETERINARIAN", "VET_TECHNICIAN", "GROOMER"]),
  specialization: z.string().min(1),
  licenseNumber: z.string().min(1),
});
