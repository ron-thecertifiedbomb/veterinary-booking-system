// ..\src\features\auth\schemas\register.schema.ts

import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),

    email: z.string().min(1, "Email is required").email("Invalid email format"),

    phone: z.string().min(1, "Phone is required"),

    password: z.string().min(1, "Password is required"),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
