import { z } from "zod";

export const MoodEnum = z.enum([
  "JOYFUL",
  "CALM",
  "NOSTALGIC",
  "TIRED",
  "ADVENTUROUS",
  "ROMANTIC",
  "HOMESICK",
]);

export const EntryStatusEnum = z.enum(["DRAFT", "PUBLISHED"]);

export const createEntrySchema = z.object({
  tripId: z.string().uuid("Invalid Volume ID"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title cannot exceed 200 characters"),
  body: z.any().default({ type: "doc", content: [] }),
  bodyText: z.string().default(""),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)),
  mood: MoodEnum.nullable().optional(),
  status: EntryStatusEnum.default("DRAFT"),
  placeName: z.string().max(200).nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  spotifyUrl: z.string().url().nullable().optional().or(z.literal("")),
  tags: z.array(z.string().min(1).max(50)).default([]),
});

// Autosave schema requires the last known updatedAt to perform conflict detection
export const patchEntrySchema = z.object({
  updatedAt: z.string().datetime({ message: "Last known updatedAt is required for conflict check" }),
  title: z.string().min(1).max(200).optional(),
  body: z.any().optional(),
  bodyText: z.string().optional(),
  date: z.string().datetime().or(z.string().regex(/^\d{4}-\d{2}-\d{2}/)).optional(),
  mood: MoodEnum.nullable().optional(),
  status: EntryStatusEnum.optional(),
  placeName: z.string().max(200).nullable().optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  spotifyUrl: z.string().url().nullable().optional().or(z.literal("")),
  tags: z.array(z.string().min(1).max(50)).optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type PatchEntryInput = z.infer<typeof patchEntrySchema>;
