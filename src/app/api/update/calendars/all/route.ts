import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { ApiUpdate } from "@/src/logging/loggerApps.config";
import { TriggerUpdateAllContract } from "./trigger-update-all.contract";
import { TriggerUpdateAllSuccessfulSchema } from "./trigger-update-all.schema";
import { ISO8601 } from "@/src/rest/iso8601.types";

const log = getLogger(ApiUpdate.all);

const handler = createNextHandler(
  TriggerUpdateAllContract,
  {
    "trigger-update-all": async ({ query }) => {
      try {
        log.debug({ query }, "Trigger update for all calendars");

        // today 0am
        const today = new Date(new Date().setHours(0, 0, 0, 0)).toISOString();
        // yesterday 0am
        const yesterday = new Date(
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000).setHours(
            0,
            0,
            0,
            0
          )
        ).toISOString();
        // in 90 days
        const futureDate = new Date(
          new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000).setHours(
            0,
            0,
            0,
            0
          )
        );

        // set defaults to update all lately updated events from yesterday to today happening in the next 90 days
        const after: ISO8601 = (query?.after as ISO8601) ?? today;
        const before: ISO8601 = (query?.before as ISO8601) ?? futureDate;
        const updatedSince: ISO8601 =
          (query?.updatedSince as ISO8601) ?? yesterday;

        /**
         * TODO:
         * - fetch all calendars from calendar-api
         * - for each create a google task, which should trigger the update of the calendar
         */

        const timestamp = new Date().toISOString();

        return {
          status: 200,
          body: {
            status: 200,
            results: 0,
            timestamp: timestamp,
            data: [],
          } as TriggerUpdateAllSuccessfulSchema,
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
