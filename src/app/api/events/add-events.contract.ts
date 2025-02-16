import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { AddEventsSuccessfulSchema } from "./add-events.schema";
import { ErrorSchema } from "@/src/rest/error.schema";
import { GoogleEvent } from "@/src/events/google-event.types";

const c = initContract();

export const AddEventsContract = c.router({
  "add-events": {
    method: "POST",
    path: "/api/events/bulk",
    body: z.array(GoogleEvent).optional(),
    responses: {
      200: AddEventsSuccessfulSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Add new events",
    description:
      "Accepts a bulk payload containing an array of events, with each event being enqueued and processed asynchronously.",
  },
});
