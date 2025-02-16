import { initContract } from "@ts-rest/core";
import { AddEventsSuccessfulSchema } from "./add-events.schema";
import { ErrorSchema } from "@/src/rest/error.schema";
import { GoogleEvent } from "@/src/events/google-event.types";

const c = initContract();

export const ProcessEventContract = c.router({
  "process-event": {
    method: "POST",
    path: "/api/events",
    body: GoogleEvent,
    responses: {
      200: AddEventsSuccessfulSchema, // TODO: fix this
      400: ErrorSchema,
      500: ErrorSchema,
    },
    summary: "Process new event",
    description: "Accepts a single event payload and processes it immediately.",
  },
});
