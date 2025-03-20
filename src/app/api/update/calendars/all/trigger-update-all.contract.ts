import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { ErrorSchema } from "@/src/rest/error.schema";
import { UpdateParamsSchema } from "../../update-params.schema";
import { TriggerUpdateAllSuccessfulSchema } from "./trigger-update-all.schema";

const c = initContract();

export const TriggerUpdateAllContract = c.router({
  "trigger-update-all": {
    method: "POST",
    path: "/api/update/calendars/all",
    query: UpdateParamsSchema,
    body: z.object({}).optional(),
    responses: {
      200: TriggerUpdateAllSuccessfulSchema,
      400: ErrorSchema,
      500: ErrorSchema,
    },
    headers: z.object({
      "Sheep-Token": z.string().optional(),
    }),
    summary:
      "Trigger an update for all calendars to update all new or changed events",
    description:
      "Triggers an update for all calendars, which will add or update all events.",
  },
});
