import { initContract } from "@ts-rest/core";
import {
  HealthyApiStatusSchema,
  UnhealthyApiStatusSchema,
} from "@/src/rest/health.schema";
import { z } from "zod";

const c = initContract();

export const GetEventsContract = c.router({
  "get-events": {
    method: "GET",
    path: "/api/events",
    responses: {
      200: HealthyApiStatusSchema,
      503: UnhealthyApiStatusSchema,
    },
    summary: "Events for a given community and a specific scope.",
    description:
      "Returns a list of events for a given community and a specific scope.",
  },
});
