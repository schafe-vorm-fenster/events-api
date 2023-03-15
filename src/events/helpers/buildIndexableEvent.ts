import { raw } from "express";
import { RuralEventScope } from "../../../packages/rural-event-types/src/ruralEventScopes";
import {
  EventClassification,
  EventMetadata,
  PostEventRequestBody,
} from "../events.types";
import { GeoLocation } from "../geocode/types/GeoLocation";
import { IndexedEvent } from "../search/types";
import { TranslatedContent } from "../translate/translateContent";

export const buildIndexableEvent = (
  rawEvent: PostEventRequestBody,
  uuid: string,
  geolocation: GeoLocation,
  metadata: EventMetadata | null,
  scope: RuralEventScope,
  classification: EventClassification | null,
  translatedContent: TranslatedContent | null
): IndexedEvent => {
  const indexableEvent: IndexedEvent = {
    id: uuid,
    "summary.de": translatedContent?.de?.title || "",
    "summary.en": translatedContent?.en?.title || "",
    "summary.pl": translatedContent?.pl?.title || "",
    "description.de": translatedContent?.de?.body || "",
    "description.en": translatedContent?.en?.body || "",
    "description.pl": translatedContent?.pl?.body || "",
    link: metadata?.url || "",
    image: metadata?.image || "",
    document: "",
    categories: classification?.categories || [],
    "classification.l1": classification?.["classification.l1"] || [],
    "classification.l2": classification?.["classification.l2"] || [],
    "classification.l3": classification?.["classification.l3"] || [],
    start: 0, // TODO: implement mapper to timestamp
    end: 0, // TODO: implement mapper to timestamp
    allday: false, // TODO: implement
    occurrence:
      rawEvent?.recurrence &&
      rawEvent?.recurrence?.length > 0 &&
      rawEvent.recurringEventId
        ? "recurring"
        : "", // TODO: implement
    "location.raw": rawEvent.location || "",
    "location.name":
      geolocation.localName || geolocation.name || rawEvent.location || "",
    "location.address": geolocation.address || rawEvent.location || "",
    "location.geopoint": [
      geolocation.geo?.point.lat || 0,
      geolocation.geo?.point.lng || 0,
    ],
    scope: scope,
    "community.id":
      "geoname." + geolocation.hierarchy?.community?.geonameId || "",
    "community.geopoint": [
      geolocation.geo?.point.lat || 0,
      geolocation.geo?.point.lng || 0,
    ], // TODO: extend geo api to use community geopoint
    "community.name": geolocation.hierarchy?.community?.name || "",
    "municipality.id":
      "geoname." + geolocation.hierarchy?.municipality?.geonameId,
    "municipality.name": geolocation.hierarchy?.municipality?.name || "",
    "county.id": "geoname." + geolocation.hierarchy?.county?.geonameId || "",
    "county.name": geolocation.hierarchy?.county?.name || "",
    "state.id": "geoname." + geolocation.hierarchy?.state?.geonameId || "",
    "state.name": geolocation.hierarchy?.state?.name || "",
    "country.id": "geoname." + geolocation.hierarchy?.country?.geonameId || "",
    "country.name": geolocation.hierarchy?.country?.name || "",
    "organizer.id": rawEvent.organizer?.id || rawEvent.organizer?.email || "", // TODO: better organizer id from crm?
    "organizer.name": rawEvent.organizer?.displayName || "",
    "calendar.id": rawEvent.creator?.id || rawEvent.creator?.email || "", // TODO: calendar from crm?
    "calendar.name": rawEvent.creator?.displayName || "",
    created: 0, // TODO interprete date to timestamp
    changed: 0, // TODO interprete date to timestamp
    deleted: 0, // TODO interprete date to timestamp
  };

  return indexableEvent;
};
