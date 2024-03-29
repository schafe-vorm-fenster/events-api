import type { NextApiRequest, NextApiResponse } from "next";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import client from "../../../src/events/search/client";
import { isValidGoogleEvent } from "../../../src/events/helpers/json/isValidGoogleEvent";
import { isValidJson } from "../../../src/events/helpers/json/isValidJson";
import { GeoLocation } from "../../../src/events/geocode/types/GeoLocation";
import {
  EventContentWithMetadata,
  PostEventRequestBody,
} from "../../../src/events/events.types";
import { RuralEventScope } from "../../../packages/rural-event-types/dist/ruralEventTypes";

import { getMetadataFromContent } from "../../../src/events/classify/getMetadataFromContent";
import { geoCodeLocation } from "../../../src/events/geocode/geoCodeLocation";
import { mapScopes } from "../../../src/events/scopes/mapScopes";
import { classifyContent } from "../../../src/events/classify/classifyContent";
import { buildIndexableEvent } from "../../../src/events/helpers/buildIndexableEvent";
import { IndexedEvent } from "../../../src/events/search/types";
import { HttpError } from "http-errors";
import { getLogger } from "../../../logging/logger";
import eventsSchema from "../../../src/events/search/schema";
import { RuralEventClassification } from "../../../packages/rural-event-categories/src/types/ruralEventClassification.types";
import { isCancelledEvent } from "../../../src/events/helpers/json/isCancelledEvent";
import { isGoogleEvent } from "../../../src/events/helpers/json/isGoogleEvent";
import {
  TranslatedContents,
  translateContent,
} from "../../../src/events/translate/translateContent";
import { getGeoLocation } from "../../../src/events/geocode/getGeoLocation";

export type CreateSchemaResponse = any;

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Creates an event.
 *     description: Based on an incoming google event json, the api creates a new event.
 *     tags:
 *       - Events
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Created.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateSchemaResponse>
) {
  const log = getLogger("api.events.post");

  // check if the body contains a valid google event including json check
  try {
    isGoogleEvent(req.body);
  } catch (error: any) {
    log.warn({ body: req.body }, "Request body is no valid google event.");
    res.status(400).json({
      status: 400,
      error: error?.message || "Request json is not a valid google event.",
    });
  }

  // handle cancelled event first
  if (isCancelledEvent(req.body)) {
    return res.status(422).json({
      status: 422,
      message:
        "Request json indicates a cancelled event. Please use the delete endpoint instead.",
    });
  }
  try {
    isValidGoogleEvent(req.body);
    log.debug({ body: req.body }, "Request json is valid.");
  } catch (error: HttpError | any) {
    let httpCode: number | undefined;
    if (error instanceof TypesenseError) httpCode = error?.httpStatus;
    if (error instanceof HttpError) httpCode = error?.status;
    log.warn(
      { body: req.body, error: error },
      "Request json is not valid: ",
      error.message
    );
    return res.status(httpCode || 500).json({
      status: httpCode || 400,
      message: error.message
        ? `Request json is not valid: ${error.message}`
        : "Request json is not valid.",
    });
  }

  // use the incoming event data
  const eventObject: PostEventRequestBody = req.body as PostEventRequestBody;

  // prepare enhancement of the event data
  let geolocation: GeoLocation | null;
  let metadata: EventContentWithMetadata | null;
  let scope: RuralEventScope;
  let classification: RuralEventClassification | null;
  let translatedContents: TranslatedContents | null;

  // let organizerMetadata: OrganizerMetadata | null;

  try {
    // create uuid based on the event data
    metadata = getMetadataFromContent(eventObject?.description as string); // data needed in the next steps

    // TODO: fetch calendar metadata and organizer metadata to use defaults for tags, location, scope, classification, etc.

    // do in parallel to save time
    [geolocation, scope, classification, translatedContents] =
      await Promise.all([
        geoCodeLocation(eventObject?.location as string),
        mapScopes(metadata?.scopes as string[]),
        classifyContent({
          summary: eventObject.summary as string,
          description: (eventObject.description as string) || "",
          tags: metadata?.tags as string[],
          occurrence: eventObject?.recurringEventId ? "recurring" : "once",
        }),
        translateContent(
          eventObject.summary as string,
          eventObject.description as string
        ),
      ]);

    log.debug(
      { geolocation, scope, classification, translatedContents },
      "Enhanced event data."
    );
  } catch (error: any) {
    log.warn({ error: error?.message }, "Could not enrich event data.");
    return res.status(error?.httpCode || 500).json({
      status: error?.httpCode || 500,
      message:
        error?.message || "Could not enrich event data for unknown reason.",
    } as HttpError);
  }

  // check enrichment results
  if (!geolocation) {
    log.error(
      {
        eventId: eventObject.id,
        geolocation,
        scope,
        classification,
        translatedContents,
      },
      "Could not enrich event data: No geolocation found"
    );
    return res.status(424).json({
      status: 424,
      message: "Could not enrich event data: No geolocation found",
    } as HttpError);
  }

  if (!translatedContents) {
    log.error(
      {
        eventId: eventObject.id,
        geolocation,
        scope,
        classification,
        translatedContents,
      },
      "Could not enrich event data: No translated contents found"
    );
    return res.status(424).json({
      status: 424,
      message: "Could not enrich event data: No translated contents found",
    } as HttpError);
  }

  const community: GeoLocation = (await getGeoLocation(
    geolocation?.hierarchy?.community?.geonameId as number
  )) as GeoLocation;

  // build proper indexable object
  const newEvent: IndexedEvent = buildIndexableEvent(
    eventObject,
    geolocation as GeoLocation,
    community as GeoLocation,
    metadata,
    scope,
    classification,
    translatedContents
  );

  return client
    .collections(eventsSchema.name)
    .documents()
    .create(newEvent)
    .then((data: any) => {
      log.debug(
        {
          eventId: newEvent.id,
        },
        "Event created successfully"
      );
      return res.status(201).json({
        status: 201,
        message: "Event created successfully",
        data: data,
      });
    })
    .catch((error: TypesenseError) => {
      // if error is an already exists, try to update instead
      if (error.httpStatus === 409) {
        log.debug(
          {
            eventId: newEvent.id,
          },
          "Event already exists, trying to update instead"
        );
        return client
          .collections(eventsSchema.name)
          .documents(newEvent.id)
          .update(newEvent)
          .then((data: any) => {
            log.debug(
              {
                eventId: newEvent.id,
              },
              "Event updated successfully"
            );
            return res.status(201).json({
              status: 201,
              message: "Event updated successfully",
              data: data,
            });
          })
          .catch((error: TypesenseError) => {
            log.error(
              {
                eventId: newEvent.id,
              },
              "Event could not be updated"
            );
            return res.status(500).json({
              status: 500,
              message: "Event could not be updated",
              error: error,
            });
          });
      } else {
        log.error(
          {
            eventId: newEvent.id,
          },
          "Event cloud not be created"
        );
        res.status(500).json({
          status: 500,
          message: "Event could not be created",
          error: error,
        });
      }
    });
}
