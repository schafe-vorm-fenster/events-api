import { z } from "zod";

export const ApiErrorSchema = z.object({
  status: z.number().min(400).max(599),
  error: z.string(),
  trace: z.any().optional(),
});

export type ApiErrorSchema = z.infer<typeof ApiErrorSchema>;
