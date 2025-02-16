import { z } from "zod";

// Queue task
export const Task = z.object({
  queueTaskId: z.string(),
  eventID: z.string(),
});

export type Task = z.infer<typeof Task>;
