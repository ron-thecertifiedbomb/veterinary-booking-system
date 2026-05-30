import { z } from "zod";

export const addPetSchema = z.object({
  petName: z.string().min(1, "Pet name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().min(1, "Breed is required") ,
  weight: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Weight must be a number",
    }),
});
