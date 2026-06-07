
import { adminSchema } from "@/features/admin/schemas/adminSchema";
import { z } from "zod";

import { staffSchema } from "@/features/admin/schemas/staffSchema";




export type StaffFormData = z.infer<typeof staffSchema>;

export type AdminFormData = z.infer<typeof adminSchema>;

export type AdminPosition = "MANAGER" | "ACCOUNTANT" | "RECEPTIONIST";
