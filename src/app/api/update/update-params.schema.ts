import { ISO8601Schema } from "@/src/rest/iso8601.types";
import { z } from "zod";

export const UpdateParamsSchema = z.object({
  after: ISO8601Schema.optional().describe(
    "Datetime in ISO8601 format to define the lower bound of the time interval to filter for"
  ),
  before: ISO8601Schema.optional().describe(
    "Datetime in ISO8601 format to define the upper bound of the time interval to filter for"
  ),
  updatedSince: ISO8601Schema.optional().describe(
    "Datetime in ISO8601 format to define the lower bound for an events last modification time"
  ),
});
