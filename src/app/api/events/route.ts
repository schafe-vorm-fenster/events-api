import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import { GoogleEvent } from "@/src/events/types/google-event.types";
import { ErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { ApiEvents } from "@/src/logging/loggerApps.config";
import { AddEventSuccessfulSchema } from "./add-event.schema";
import { isGoogleEvent } from "@/src/events/helpers/json/isGoogleEvent";
import { isCancelledEvent } from "@/src/events/helpers/json/isCancelledEvent";
import { isValidGoogleEvent } from "@/src/events/helpers/json/isValidGoogleEvent";
import { qualifyEvent } from "@/src/events/qualify/qualifyEvent";

import eventsSchema from "@/src/events/schema/typesense.schema";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import { IndexedEvent } from "@/src/events/types/indexed-event.types";
import { eventUuid } from "@/src/events/helpers/uuids/eventUuid";
import client from "@/src/clients/typesense/search/client";
import { deleteEvents } from "@/src/clients/typesense/search/deleteEvents";
import { DeleteEventsSuccessfulSchema } from "./delete-event.schema";
import { AddOrDeleteEventsContract } from "./events.contract";

const log = getLogger(ApiEvents.post);

const handler = createNextHandler(
  AddOrDeleteEventsContract,
  {
    "add-event": async ({ body }: { body: GoogleEvent }) => {
      const incomingEvent = body as GoogleEvent;

      // check if the body contains a valid google event including json check
      try {
        isGoogleEvent(incomingEvent);
        isValidGoogleEvent(incomingEvent);
      } catch (error: unknown) {
        log.warn(
          { body: incomingEvent },
          "Request body is no valid google event."
        );
        return {
          status: 400,
          body: {
            status: 400,
            error:
              (error as Error)?.message ||
              "Request json is not a valid google event.",
          } as ErrorSchema,
        };
      }

      // handle cancelled event by deleting it
      if (isCancelledEvent(incomingEvent)) {
        try {
          const eventId = eventUuid(incomingEvent);

          const deleteResult = await deleteEvents({
            id: eventId,
          });
          log.debug({ deleteResult }, "Cancelled event deleted");
          return {
            status: 200,
            body: {
              status: 200,
              timestamp: new Date().toISOString(),
              message: "Cancelled event deleted successfully",
              data: { id: eventId },
            } as AddEventSuccessfulSchema,
          };
        } catch (error: unknown) {
          log.error({ error }, "Error deleting cancelled event");
          return {
            status: 500,
            body: {
              status: (error as TypesenseError).httpStatus || 500,
              error:
                (error as TypesenseError).message ||
                "Error deleting cancelled event",
            } as ErrorSchema,
          };
        }
      }

      let indexableEvent: IndexedEvent;

      try {
        // Process incoming event using the new qualifyEvent function
        indexableEvent = (await qualifyEvent(incomingEvent)) as IndexedEvent;

        log.debug({ body: incomingEvent }, "Event is fully qualified");

        // Create or update the event in the database
        try {
          const data: IndexedEvent = (await client
            .collections(eventsSchema.name)
            .documents()
            .create(indexableEvent)) as IndexedEvent;

          return {
            status: 200,
            body: {
              status: 201,
              timestamp: new Date().toISOString(),
              message: "Event created successfully",
              data: data,
            } as AddEventSuccessfulSchema,
          };
        } catch (error) {
          if (error instanceof TypesenseError && error.httpStatus === 409) {
            // Update existing event
            const data: IndexedEvent = (await client
              .collections(eventsSchema.name)
              .documents(indexableEvent.id as string)
              .update(indexableEvent)) as IndexedEvent;

            return {
              status: 200,
              body: {
                status: 200,
                results: 1,
                timestamp: new Date().toISOString(),
                message: "Event updated successfully",
                data: data,
              } as AddEventSuccessfulSchema,
            };
          }
          throw error;
        }
      } catch (error: unknown) {
        log.error({ error }, "Error processing event");

        return {
          status: 500,
          body: {
            status: 500,
            error: (error as Error)?.message ?? "Internal Server Error",
          } as ErrorSchema,
        };
      }
    },
    "delete-events": async ({ query }: { query: { before?: string } }) => {
      const log = getLogger(ApiEvents["delete-by-date"]);

      try {
        const result = await deleteEvents({
          before: query.before || "now",
        });
        log.debug({ result }, "Events deleted");

        if (result?.deleted === 0) {
          return {
            status: 200,
            body: {
              status: 204,
              results: 0,
              timestamp: new Date().toISOString(),
              message: "No events found to delete",
            } as DeleteEventsSuccessfulSchema,
          };
        }

        return {
          status: 200,
          body: {
            status: 200,
            results: result.deleted,
            timestamp: new Date().toISOString(),
            message: `Successfully deleted events`,
          } as DeleteEventsSuccessfulSchema,
        };
      } catch (error: unknown) {
        log.error({ error }, "Error deleting events");
        return {
          status: 500,
          body: {
            status: 500,
            error: (error as Error)?.message || "Error deleting events",
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

export { handler as POST, handler as DELETE };
