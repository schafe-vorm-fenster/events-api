import { initContract } from "@ts-rest/core";
import {
  HealthyApiStatusSchema,
  UnhealthyApiStatusSchema,
} from "@/src/rest/health.schema";
import { z } from "zod";

const c = initContract();

export const GetEventContract = c.router({
  "get-event": {
    method: "GET",
    path: "/api/events/:id",
    responses: {
      200: HealthyApiStatusSchema,
      503: UnhealthyApiStatusSchema,
    },
    metadata: {
      description: "Get a single event",
    },
  },
});
