import { Task } from "@/src/queue/queue.types";
import { ResultsSchema } from "@/src/rest/results.schema";
import { z } from "zod";
import { UpdateParamsSchema } from "../../update-params.schema";

export const TaskList = z.array(Task);

export const SingleCalendarUpdateBodySchema = UpdateParamsSchema.extend({
  id: z.string().describe("The id of the calendar to update"),
});
export type SingleCalendarUpdateBody = z.infer<
  typeof SingleCalendarUpdateBodySchema
>;

export const TriggerUpdateCalendarSuccessfulSchema = ResultsSchema.extend({
  data: TaskList,
});

export type TriggerUpdateCalendarSuccessfulSchema = z.infer<
  typeof TriggerUpdateCalendarSuccessfulSchema
>;
