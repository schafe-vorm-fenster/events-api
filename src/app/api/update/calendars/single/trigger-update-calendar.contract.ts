import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorSchema } from "@/src/rest/error.schema";
import {
  SingleCalendarUpdateBodySchema,
  TriggerUpdateCalendarSuccessfulSchema,
} from "./trigger-update-calendar.schema";

const c = initContract();

export const TriggerUpdateCalendarContract = c.router({
  "trigger-update-calendar": {
    method: "POST",
    path: "/api/update/calendars/single",
    body: SingleCalendarUpdateBodySchema,
    responses: {
      200: TriggerUpdateCalendarSuccessfulSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    headers: z.object({
      "Sheep-Token": z.string().optional(),
    }),
    summary: "Trigger an update for a specific calendar",
    description:
      "Triggers an update for a specific calendar, which will update all events in the calendar.",
  },
});
