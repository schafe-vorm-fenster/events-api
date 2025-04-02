import { RuralEventScopeSchema } from "@/packages/rural-event-types/src/rural-event-scope.types";
import { z } from "zod";

/**
 * Schema for the scopify by content query.
 * Ensures that the summary is a string and not empty.
 * Keep all information loose and optional.
 */
export const ScopifyContentQuerySchema = z.object({
  summary: z.string(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  allday: z.boolean().optional(),
  occurrence: z.string().optional(),
});
export type ScopifyContentQuery = z.infer<typeof ScopifyContentQuerySchema>;

export const ScopifyContentResponseSchema = RuralEventScopeSchema;
export type ScopifyContentResponse = z.infer<
  typeof ScopifyContentResponseSchema
>;

/**
 * Fallback values, if scopification API is not available.
 */
export const FallbackScopification: ScopifyContentResponse = "community";
