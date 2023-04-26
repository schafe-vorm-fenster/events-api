import type { NextApiRequest, NextApiResponse } from "next";
import { TypesenseError } from "typesense/lib/Typesense/Errors";
import client from "../../../src/events/search/client";
import { isValidGoogleEvent } from "../../../src/events/helpers/json/isValidGoogleEvent";
import { isValidJson } from "../../../src/events/helpers/json/isValidJson";
import { GeoLocation } from "../../../src/events/geocode/types/GeoLocation";
import {
  EventClassification,
  EventContentWithMetadata,
  PostEventRequestBody,
} from "../../../src/events/events.types";
import { RuralEventScope } from "../../../packages/rural-event-types/dist/ruralEventTypes";
import {
  TranslatedContent,
  translateContent,
} from "../../../src/events/translate/translateContent";
import { getMetadataFromContent } from "../../../src/events/classify/getMetadataFromContent";
import { geoCodeLocation } from "../../../src/events/geocode/geoCodeLocation";
import { mapScopes } from "../../../src/events/scopes/mapScopes";
import { classifyContent } from "../../../src/events/classify/classifyContent";
import { buildIndexableEvent } from "../../../src/events/helpers/buildIndexableEvent";
import { IndexedEvent } from "../../../src/events/search/types";
import { HttpError } from "http-errors";
import { getLogger } from "../../../logging/logger";
import eventsSchema from "../../../src/events/search/schema";

export type CreateSchemaResponse = any;

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Creates an events.
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

  if (!isValidJson(req.body)) {
    log.warn("Request json is not valid");
    res.status(422).json({ error: "Request json is not valid" });
  }

  try {
    isValidGoogleEvent(req.body);
    log.debug("Request json is valid");
  } catch (error: HttpError | any) {
    let httpCode: number | undefined;
    if (error instanceof TypesenseError) httpCode = error?.httpStatus;
    if (error instanceof HttpError) httpCode = error?.status;
    log.warn("Request json is not valid: ", error.message);
    return res.status(httpCode || 500).json({
      status: httpCode || 422,
      message: error.message
        ? `Request json is not valid: ${error.message}`
        : "Request json is not valid",
    });
  }

  // use the incoming event data
  const eventObject: PostEventRequestBody = req.body as PostEventRequestBody;

  // prepare enhancement of the event data
  let geolocation: GeoLocation | null;
  let metadata: EventContentWithMetadata | null;
  let scope: RuralEventScope;
  let classification: EventClassification | null;
  let translatedContent: TranslatedContent | null;

  try {
    // create uuid based on the event data
    metadata = getMetadataFromContent(eventObject?.description as string); // data needed in the next steps

    // TODO: fetch detailled geo data for community --- or not??

    // do in parallel to save time
    [geolocation, scope, classification, translatedContent] = await Promise.all(
      [
        geoCodeLocation(eventObject?.location as string),
        mapScopes(metadata?.scopes as string[]),
        classifyContent(
          metadata?.tags as string[],
          ((eventObject.summary as string) + eventObject.description) as string
        ),
        translateContent(
          eventObject.summary as string,
          eventObject.description as string
        ),
      ]
    );

    log.debug(
      { geolocation, scope, classification, translatedContent },
      "Enhanced event data"
    );
  } catch (error: TypesenseError | any) {
    let httpCode: number | undefined;
    if (error instanceof TypesenseError) httpCode = error?.httpStatus;
    log.warn("Could not enrich event data: ", error.message);
    return res.status(httpCode || 500).json({
      status: httpCode || 500,
      message:
        error.message || "Could not enrich event data for unknown reason.",
    });
  }

  // TODO: check enrichment results
  if (!geolocation) {
    log.warn(
      { eventId: eventObject.id },
      "Could not enrich event data: ",
      "No geolocation found"
    );
  }

  // build proper indexable object
  const newEvent: IndexedEvent = buildIndexableEvent(
    eventObject,
    geolocation,
    metadata,
    scope,
    classification,
    translatedContent
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
            log.debug(
              {
                eventId: newEvent.id,
              },
              "Event could not be updated"
            );
            throw error;
          });
      } else {
        log.debug(
          {
            eventId: newEvent.id,
          },
          "Event cloud not be created"
        );
        throw error;
      }
    });
}
