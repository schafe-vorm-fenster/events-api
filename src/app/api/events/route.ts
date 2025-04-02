import { createNextHandler } from "@ts-rest/serverless/next";
import { getLogger } from "@/src/logging/logger";
import {
  GoogleEvent,
  GoogleEventSchema,
} from "@/src/events/types/google-event.types";
import { ApiError, ApiErrorSchema } from "@/src/rest/error.schema";
import { handleZodError } from "@/src/rest/zod-error-handler";
import { ApiEvents } from "@/src/logging/loggerApps.config";
import { AddEventSuccessfulSchema } from "./add-event.schema";
import { isGoogleEvent } from "@/src/events/helpers/json/isGoogleEvent";
import { isCancelledEvent } from "@/src/events/helpers/json/isCancelledEvent";
import { isValidGoogleEvent } from "@/src/events/helpers/json/isValidGoogleEvent";
import { IndexedEvent } from "@/src/events/types/indexed-event.types";
import { eventUuid } from "@/src/events/helpers/uuids/eventUuid";
import { DeleteEventsSuccessfulSchema } from "./delete-event.schema";
import { AddOrDeleteEventsContract } from "./events.contract";
import { createOrUpdateEvent } from "@/src/clients/typesense/create-or-update-event";
import { deleteEvent } from "@/src/clients/typesense/delete-event";
import { deleteEventsBefore } from "@/src/clients/typesense/delete-events-before";
import { qualifyEvent } from "@/src/events/qualify/qualify-event";

const log = getLogger(ApiEvents.post);

const handler = createNextHandler(
  AddOrDeleteEventsContract,
  {
    "add-event": async ({ body }: { body: GoogleEvent }) => {
      const incomingEvent = body as GoogleEvent;

      try {
        GoogleEventSchema.parse(incomingEvent);
      } catch (error) {
        log.error({ error }, "Error parsing request body");
        throw new Error("Error parsing request body");
      }

      // sanity check
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
          } as ApiErrorSchema,
        };
      }

      // handle cancelled event by deleting it
      if (isCancelledEvent(incomingEvent)) {
        try {
          const eventId = eventUuid(incomingEvent);

          const deleteResult = await deleteEvent(eventId);
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
              status: error instanceof ApiError ? error.status : 500,
              error:
                error instanceof Error
                  ? error.message
                  : "Error deleting cancelled event",
            } as ApiErrorSchema,
          };
        }
      }

      let indexableEvent: IndexedEvent;

      try {
        // Process incoming event using the new qualifyEvent function
        indexableEvent = (await qualifyEvent(incomingEvent)) as IndexedEvent;
        log.debug(
          { incomingEvent, indexableEvent },
          "Event is fully qualified"
        );
      } catch (error) {
        log.error({ error }, "Error qualifying event");
        return {
          status: 500,
          body: {
            status: 500,
            error: (error as Error)?.message || "Error qualifying event",
          } as ApiErrorSchema,
        };
      }

      // Create or update the event in the database
      try {
        const data = await createOrUpdateEvent(indexableEvent);
        log.debug({ data }, "Event created or updated successfully");
        return {
          status: 200,
          body: {
            status: 201,
            timestamp: new Date().toISOString(),
            message: "Event created or updated successfully",
            data: data,
          } as AddEventSuccessfulSchema,
        };
      } catch (error: ApiErrorSchema | unknown) {
        log.error(
          { error, data: indexableEvent },
          "Error creating or updating event"
        );
        return {
          status: 500,
          body: {
            status: error instanceof ApiError ? error.status : 500,
            error:
              error instanceof Error
                ? error.message
                : "Error creating or updating event",
          } as ApiErrorSchema,
        };
      }
    },
    "delete-events": async ({ query }: { query: { before?: string } }) => {
      const log = getLogger(ApiEvents["delete-by-date"]);

      try {
        const timestamp = new Date().toISOString();
        const result = await deleteEventsBefore(query.before || "now");
        log.debug({ data: result }, "Events deleted");

        if (result === 0) {
          return {
            status: 200,
            body: {
              status: 204,
              results: 0,
              timestamp: timestamp,
              message: "No events found to delete",
            } as DeleteEventsSuccessfulSchema,
          };
        }

        return {
          status: 200,
          body: {
            status: 200,
            results: result,
            timestamp: timestamp,
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
          } as ApiErrorSchema,
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
