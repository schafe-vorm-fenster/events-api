import { createNextHandler } from "@ts-rest/serverless/next";
import { AddEventsContract } from "./add-events.contract";
import { getLogger } from "@/logging/logger";
import { api } from "@/logging/loggerApps.config";
import { GoogleEvent } from "@/src/events/google-event.types";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { addEventToQueue } from "@/src/queue/add-event-to-queue";
import { AddEventsSuccessfulSchema } from "./add-events.schema";

const log = getLogger(api.events.post);

const handler = createNextHandler(
  AddEventsContract,
  {
    "add-events": async ({ body }, res) => {
      const incomingEvents = body as GoogleEvent[];

      try {
        // Send all events to the queue.
        // This is done in parallel to speed up the process.
        // As result, we get an array of tasks incl. the task id.
        const tasks = await Promise.all(
          incomingEvents.map(async (event) => {
            return await addEventToQueue(event);
          })
        );

        return {
          status: 200,
          body: {
            status: 200,
            results: incomingEvents.length,
            timestamp: new Date().toISOString(),
            data: tasks,
          } as AddEventsSuccessfulSchema,
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
    handlerType: "app-router",
    errorHandler: handleZodError,
  }
);

export { handler as POST };
