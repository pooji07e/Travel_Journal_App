import { z } from "zod";

export const createTripSchema = z.object({
  title: z
    .string()
    .min(1, "Trip title is required")
    .max(120, "Trip title cannot exceed 120 characters"),
  startDate: z.string().datetime().nullable().optional(),
  endDate: z.string().datetime().nullable().optional(),
  coverMediaId: z.string().nullable().optional(),
});

export const updateTripSchema = createTripSchema.partial();

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;
