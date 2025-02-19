import { ResultSchema } from "@/src/rest/result.schema";
import { ResultsSchema } from "@/src/rest/results.schema";
import { z } from "zod";

export const DeleteDateSchema = z.union([
  z.literal("now"),
  z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid ISO8601 date format",
  }),
]);
export type DeleteDateSchema = z.infer<typeof DeleteDateSchema>;

export const AddEventSuccessfulSchema = ResultSchema.extend({
  data: z.any().optional(), // TODO: Add IndexedEvent as type here
});

export type AddEventSuccessfulSchema = z.infer<typeof AddEventSuccessfulSchema>;

export const DeleteEventsSuccessfulSchema = ResultsSchema;

export type DeleteEventsSuccessfulSchema = z.infer<
  typeof DeleteEventsSuccessfulSchema
>;
