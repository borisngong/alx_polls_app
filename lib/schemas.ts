import { z } from "zod";

export const createPollSchema = z.object({
  title: z
    .string()
    .min(1, "Poll title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  options: z
    .array(z.object({ value: z.string().min(1, "Option cannot be empty") }))
    .min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
  expiresAt: z.string().optional(),
});

export type CreatePollFormData = z.infer<typeof createPollSchema>;
