import { RuralEventClassification } from "../../../packages/rural-event-categories/src/types/ruralEventClassification.types";
import { RuralEventScope } from "../../../packages/rural-event-types/src/ruralEventScopes";
import {
  EventClassification,
  EventContentWithMetadata,
  PostEventRequestBody,
} from "../events.types";
import { GeoLocation } from "../geocode/types/GeoLocation";
import { IndexedEvent } from "../search/types";
import { TranslatedContent } from "../translate/translateContent";
import { getDocumentLinkFromAttachments } from "./attachments/getDocumentLinkFromAttachments";
import { getImageLinkFromAttachments } from "./attachments/getImageLinkFromAttachments";
import { googleDatetimeToTimestamp } from "./datetime/googleDatetimeToTimestamp";
import { eventUuid } from "./uuids/eventUuid";
import { recurringEventUuid } from "./uuids/recurringEventUuid";

export const buildIndexableEvent = (
  rawEvent: PostEventRequestBody,
  geolocation: GeoLocation,
  contentWithMetadata: EventContentWithMetadata | null,
  scope: RuralEventScope,
  classification: RuralEventClassification | null,
  translatedContent: TranslatedContent | null
): IndexedEvent => {
  const indexableEvent: IndexedEvent = {
    id: eventUuid(rawEvent),

    /**
     * contents
     */
    "summary.de":
      translatedContent?.de?.title?.trim() || rawEvent.summary || "",
    "summary.en":
      translatedContent?.en?.title?.trim() || rawEvent.summary || "",
    "summary.pl":
      translatedContent?.pl?.title?.trim() || rawEvent.summary || "",
    "summary.uk":
      translatedContent?.uk?.title?.trim() || rawEvent.summary || "",
    "summary.ru":
      translatedContent?.ru?.title?.trim() || rawEvent.summary || "",
    "description.de":
      translatedContent?.de?.body ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.en":
      translatedContent?.en?.body ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.pl":
      translatedContent?.pl?.body ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.uk":
      translatedContent?.uk?.body ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.ru":
      translatedContent?.ru?.body ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    link: contentWithMetadata?.url || "",

    /**
     * attachments
     */
    image:
      getImageLinkFromAttachments(rawEvent?.attachments) ||
      contentWithMetadata?.image ||
      "", // set google calender attachments and use from description as fallback
    "image.exists":
      getImageLinkFromAttachments(rawEvent?.attachments) ||
      contentWithMetadata?.image
        ? true
        : false,
    document:
      getDocumentLinkFromAttachments(rawEvent?.attachments) ||
      contentWithMetadata?.document ||
      "", // set google calender attachments and use from description as fallback
    "document.exists":
      getDocumentLinkFromAttachments(rawEvent?.attachments) ||
      contentWithMetadata?.document
        ? true
        : false,

    /**
     * classification and scope
     */
    categories: classification?.category
      ? [classification?.category]
      : ["unknown"],
    tags: classification?.tags || [],
    scope: scope || classification?.scope || "nearby",

    /**
     * dates and times
     */
    start: googleDatetimeToTimestamp(rawEvent?.start) || 0,
    end: googleDatetimeToTimestamp(rawEvent?.end) || 0,
    allday: rawEvent?.start?.date ? true : false,
    // TODO: check as well for recurrence[] and sequence, both could indicate a recurrency
    occurrence: rawEvent?.recurringEventId ? "recurring" : "once",
    "series.id": rawEvent?.recurringEventId
      ? recurringEventUuid(rawEvent) || ""
      : "",

    /**
     * location infos
     */
    "location.raw": rawEvent.location?.trim() || "",
    "location.name.de": geolocation.name || rawEvent.location || "",
    "location.localname.de":
      geolocation.localName || geolocation.name || rawEvent.location || "",
    "location.address": geolocation.address || rawEvent.location || "",
    "location.geopoint": [
      geolocation.geo?.point.lat || 0,
      geolocation.geo?.point.lng || 0,
    ],

    /**
     * geo data
     */
    "community.id":
      "geoname." + geolocation.hierarchy?.community?.geonameId || "",
    "community.geopoint": [
      geolocation.geo?.point.lat || 0,
      geolocation.geo?.point.lng || 0,
    ], // TODO: we need the geo point of the community
    "community.name.de": geolocation.hierarchy?.community?.name || "",
    "municipality.id":
      "geoname." + geolocation.hierarchy?.municipality?.geonameId,
    "municipality.name.de": geolocation.hierarchy?.municipality?.name || "",
    "county.id": "geoname." + geolocation.hierarchy?.county?.geonameId || "",
    "county.name.de": geolocation.hierarchy?.county?.name || "",
    "state.id": "geoname." + geolocation.hierarchy?.state?.geonameId || "",
    "state.name.de": geolocation.hierarchy?.state?.name || "",
    "country.id": "geoname." + geolocation.hierarchy?.country?.geonameId || "",
    "country.name.de": geolocation.hierarchy?.country?.name || "",

    /**
     * hierarchy data
     */
    "organizer.id": rawEvent.creator?.id || rawEvent.creator?.email || "",
    "organizer.name":
      rawEvent.creator?.displayName?.trim() || rawEvent.creator?.email || "",
    "calendar.id": rawEvent.organizer?.id || rawEvent.organizer?.email || "",
    "calendar.name":
      rawEvent.organizer?.displayName?.trim() ||
      rawEvent.creator?.displayName?.trim() ||
      "",

    /**
     * systeme data
     */
    created: googleDatetimeToTimestamp(rawEvent?.created) || 0,
    changed: googleDatetimeToTimestamp(rawEvent?.updated) || 0,
    deleted:
      rawEvent?.status === "cancelled"
        ? googleDatetimeToTimestamp(rawEvent?.updated) || 0
        : 0,
  };

  return indexableEvent;
};
