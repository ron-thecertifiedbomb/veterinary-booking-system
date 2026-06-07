import { z } from "zod";

export const adminSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(10, "Invalid phone"),
  role: z.literal("ADMIN"),
  position: z.string().min(1, "Position is required"),
  department: z.string().min(1, "Department is required"),
});
