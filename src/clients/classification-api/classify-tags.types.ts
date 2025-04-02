import { z } from "zod";

/**
 * Schema for the classify by tags query.
 * Ensures that the tags are an array of strings and not empty.
 */
export const ClassifyByTagsQuerySchema = z.object({
  tags: z.array(z.string()).nonempty(),
});
export type ClassifyByTagsQuery = z.infer<typeof ClassifyByTagsQuerySchema>;
