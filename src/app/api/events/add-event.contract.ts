import { initContract } from "@ts-rest/core";

import { ErrorSchema } from "@/src/rest/error.schema";
import { GoogleEvent } from "@/src/events/types/google-event.types";
import { AddEventSuccessfulSchema } from "./add-event.schema";
import { z } from "zod";

const c = initContract();

export const AddEventContract = c.router({
  "add-event": {
    method: "POST",
    path: "/api/events",
    body: GoogleEvent,
    responses: {
      200: AddEventSuccessfulSchema,
      400: ErrorSchema,
      422: ErrorSchema,
      500: ErrorSchema,
    },
    headers: z.object({
      "Sheep-Token": z.string().optional(),
    }),
    summary: "Add new event incl. full qualification",
    description: "Accepts a single event payload and processes it immediately.",
  },
});
