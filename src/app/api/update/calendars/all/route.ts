import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { ApiUpdate } from "@/src/logging/loggerApps.config";
import { TriggerUpdateAllContract } from "./trigger-update-all.contract";
import { TriggerUpdateAllSuccessfulSchema } from "./trigger-update-all.schema";
import { ISO8601 } from "@/src/rest/iso8601.types";
import {
  Calendar,
  getCalendars,
} from "@/src/clients/calendar-api/get-calendars";
import { addCalendarToQueue } from "@/src/queue/add-calendar-to-queue";

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
        ).toISOString();

        // set defaults to update all lately updated events from yesterday to today happening in the next 90 days
        const after: ISO8601 = (query?.after as ISO8601) ?? today;
        const before: ISO8601 = (query?.before as ISO8601) ?? futureDate;
        const updatedSince: ISO8601 =
          (query?.updatedSince as ISO8601) ?? yesterday;

        // fetch all calendars from calendar-api
        const calendars: Calendar[] = await getCalendars();

        // push all calendars to the queue
        // this is done in parallel to speed up the process.
        // as result, we get an array of tasks incl. the task id.
        const tasks = await Promise.all(
          calendars.map(async (calendar) => {
            return await addCalendarToQueue(
              calendar.id,
              after,
              before,
              updatedSince
            );
          })
        );

        const timestamp = new Date().toISOString();

        return {
          status: 200,
          body: {
            status: 200,
            results: tasks.length,
            timestamp: timestamp,
            data: tasks,
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
    responseValidation: false, // TODO: enable response validation
    handlerType: "app-router",
    errorHandler: handleZodError,
  }
);

export { handler as POST };
