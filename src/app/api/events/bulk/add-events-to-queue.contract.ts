import { initContract } from "@ts-rest/core";
import { z } from "zod";

import { ErrorSchema } from "@/src/rest/error.schema";
import { GoogleEventSchema } from "@/src/events/types/google-event.types";
import { AddEventsToQueueSuccessfulSchema } from "./add-events-to-queue.schema";

const c = initContract();

export const AddEventsToQueueContract = c.router({
  "add-events-to-queue": {
    method: "POST",
    path: "/api/events/bulk",
    body: z.array(GoogleEventSchema),
    responses: {
      200: AddEventsToQueueSuccessfulSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    headers: z.object({
      "Sheep-Token": z.string(),
    }),
    summary: "Add new events to an import queue",
    description:
      "Accepts a bulk payload containing an array of events, with each event being enqueued and processed asynchronously.",
  },
});
