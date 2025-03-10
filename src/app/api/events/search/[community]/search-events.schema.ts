import { z } from "zod";
import { IndexedEventSchema } from "@/src/events/types/indexed-event.types";
import { ResultsSchema } from "@/src/rest/results.schema";

export const SearchEventsSuccessfulSchema = ResultsSchema.extend({
  data: z.array(IndexedEventSchema),
});

export type SearchEventsSuccessfulSchema = z.infer<
  typeof SearchEventsSuccessfulSchema
>;
