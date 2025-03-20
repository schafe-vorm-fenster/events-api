import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { ApiUpdate } from "@/src/logging/loggerApps.config";
import { TriggerUpdateCalendarContract } from "./trigger-update-calendar.contract";
import { TriggerUpdateCalendarSuccessfulSchema } from "./trigger-update-calendar.schema";
import { ISO8601 } from "@/src/rest/iso8601.types";
import { getCalendarEvents } from "@/src/clients/calendar-api/get-calendar-events";
import { addEventToQueue } from "@/src/queue/add-event-to-queue";

const log = getLogger(ApiUpdate.calendar);

const handler = createNextHandler(
  TriggerUpdateCalendarContract,
  {
    "trigger-update-calendar": async ({ body }) => {
      try {
        log.debug({ body }, "Trigger update for all calendars");

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
        ).toISOString();

        // set defaults to update all events from today to 90 days in the future
        const after: ISO8601 = (body?.after as ISO8601) ?? today;
        const before: ISO8601 = (body?.before as ISO8601) ?? futureDate;
        const updatedSince: ISO8601 =
          (body?.updatedSince as ISO8601) ?? undefined;

        // get all events for the given calendar
        const events: object[] = await getCalendarEvents(
          body.id,
          after,
          before,
          updatedSince
        );

        // push all events to the queue
        // this is done in parallel to speed up the process.
        // as result, we get an array of tasks incl. the task id.
        const tasks = await Promise.all(
          events.map(async (event) => {
            return await addEventToQueue(event);
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
          } as TriggerUpdateCalendarSuccessfulSchema,
        };
      } catch (error) {
        log.error({ error }, "Error adding events to queue");

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
