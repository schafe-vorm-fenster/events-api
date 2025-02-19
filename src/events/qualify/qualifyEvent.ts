import { GoogleEvent } from "../google-event.types";
import { IndexedEvent } from "../search/types";
import { GeoLocation } from "../geocode/types/GeoLocation";
import { EventContentWithMetadata } from "../events.types";
import { RuralEventScope } from "../../../packages/rural-event-types/dist/ruralEventTypes";
import { RuralEventClassification } from "../../../packages/rural-event-categories/src/types/ruralEventClassification.types";
import { TranslatedContents } from "../translate/translateContent";
import { getMetadataFromContent } from "../classify/getMetadataFromContent";
import { geoCodeLocation } from "../geocode/geoCodeLocation";
import { mapScopes } from "../scopes/mapScopes";
import { classifyContent } from "../classify/classifyContent";
import { translateContent } from "../translate/translateContent";
import { getGeoLocation } from "../geocode/getGeoLocation";
import { buildIndexableEvent } from "../helpers/buildIndexableEvent";
import debug from "debug";

const log = debug("events-api:qualify");

async function measureTime<T>(name: string, fn: Promise<T>): Promise<T> {
  const start = Date.now();
  try {
    const result = await fn;
    const duration = Date.now() - start;
    log(`${name} took ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    log(`${name} failed after ${duration}ms`);
    throw error;
  }
}

export async function qualifyEvent(
  incomingEvent: GoogleEvent
): Promise<IndexedEvent> {
  // prepare enhancement of the event data
  let geolocation: GeoLocation | null;
  let metadata: EventContentWithMetadata | null;
  let scope: RuralEventScope;
  let classification: RuralEventClassification | null;
  let translatedContents: TranslatedContents | null;

  try {
    // create uuid based on the event data
    metadata = getMetadataFromContent(incomingEvent?.description as string);

    // Start all promises early
    const geoLocationPromise = measureTime(
      "geoCodeLocation",
      geoCodeLocation(incomingEvent?.location as string)
    );
    const scopePromise = measureTime(
      "mapScopes",
      mapScopes(metadata?.scopes as string[])
    );
    const classificationPromise = measureTime(
      "classifyContent",
      classifyContent({
        summary: incomingEvent.summary as string,
        description: (incomingEvent.description as string) || "",
        tags: metadata?.tags as string[],
        occurrence: incomingEvent?.recurringEventId ? "recurring" : "once",
      })
    );
    const translationPromise = measureTime(
      "translateContent",
      translateContent(
        incomingEvent.summary as string,
        incomingEvent.description as string
      )
    );

    // Resolve promises with individual error handling
    geolocation = await geoLocationPromise;
    if (!geolocation) {
      throw new Error("No geolocation found");
    }

    const community = await measureTime(
      "getGeoLocation",
      getGeoLocation(
        geolocation.hierarchy?.community?.geonameId as number
      ) as Promise<GeoLocation>
    );

    scope = await scopePromise;

    classification = await classificationPromise;

    translatedContents = await translationPromise;

    // build proper indexable object
    const newEvent: IndexedEvent = buildIndexableEvent(
      incomingEvent,
      geolocation,
      community,
      metadata,
      scope,
      classification,
      translatedContents
    );

    return newEvent;
  } catch (error: any) {
    throw error instanceof Error
      ? error
      : new Error("Could not enrich event data for unknown reason");
  }
}
