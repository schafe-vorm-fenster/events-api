import { Task } from "@/src/queue/queue.types";
import { ResultSchema } from "@/src/rest/result.schema";
import { z } from "zod";

export const TaskList = z.array(Task);

export const AddEventsSuccessfulSchema = ResultSchema.extend({
  data: TaskList,
});

export type AddEventsSuccessfulSchema = z.infer<
  typeof AddEventsSuccessfulSchema
>;
