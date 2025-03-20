import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { ApiUpdate } from "@/src/logging/loggerApps.config";
import { TriggerUpdateCalendarContract } from "./trigger-update-calendar.contract";
import { TriggerUpdateCalendarSuccessfulSchema } from "./trigger-update-calendar.schema";
import { ISO8601 } from "@/src/rest/iso8601.types";

const log = getLogger(ApiUpdate.calendar);

const handler = createNextHandler(
  TriggerUpdateCalendarContract,
  {
    "trigger-update-calendar": async ({ params, query }) => {
      try {
        log.debug({ params, query }, "Trigger update for all calendars");

        // today 0am
        const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        // in 90 days
        const futureDate = new Date(
          new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).setHours(
            0,
            0,
            0,
            0
          )
        );

        // set defaults to update all events from today to 90 days in the future
        const after: ISO8601 = (query?.after as ISO8601) ?? today;
        const before: ISO8601 = (query?.before as ISO8601) ?? futureDate;
        const updatedSince: ISO8601 =
          (query?.updatedSince as ISO8601) ?? undefined;

        /**
         * TODO:
         * - fetch all events for the given calendar from calendar-api
         * - for each create a google task for the bulk event import
         */

        const timestamp = new Date().toISOString();

        return {
          status: 200,
          body: {
            status: 200,
            results: 0,
            timestamp: timestamp,
            data: [],
          } as TriggerUpdateCalendarSuccessfulSchema,
        };
      } catch (error) {
        log.error({ error }, "Error adding events");

        return {
          status: 500,
          body: {
            status: 500,
            error: error ?? "Internal Server Error",
          } as ErrorSchema,
        };
      }
    },
  },
  {
    jsonQuery: true,
    responseValidation: true,
    handlerType: "app-router",
    errorHandler: handleZodError,
  }
);

export { handler as POST };
