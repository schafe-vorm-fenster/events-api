import { z } from "zod";

export const RFC3339 = z
  .string()
  .regex(
    /^((?:(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2}:\d{2}(?:\.\d+)?))(Z|[\+-]\d{2}:\d{2})?)$/
  )
  .transform((v) => new Date(v).toISOString());

export type RFC3339 = z.infer<typeof RFC3339>;
