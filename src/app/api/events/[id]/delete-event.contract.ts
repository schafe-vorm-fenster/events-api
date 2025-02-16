import { initContract } from "@ts-rest/core";
import {
  HealthyApiStatusSchema,
  UnhealthyApiStatusSchema,
} from "@/src/rest/health.schema";
import { z } from "zod";

const c = initContract();

export const DeleteEventContract = c.router({
  "delete-event": {
    method: "DELETE",
    path: "/api/events/:id",
    body: z.any(),
    responses: {
      200: HealthyApiStatusSchema,
      503: UnhealthyApiStatusSchema,
    },
    metadata: {
      description: "Delete an event",
    },
  },
});
