import { getLogger } from "../../logging/logger";
import { RuralEventClassification } from "../../../packages/rural-event-types/src/rural-event-classification.types";
import { RuralEventScope } from "../../../packages/rural-event-types/src/rural-event-scope.types";
import {
  EventContentWithMetadata,
  PostEventRequestBody,
} from "../events.types";
import { GeoLocation } from "../../clients/geo-api/types/geo-location.types";
import { IndexedEvent } from "../types/indexed-event.types";

import { getDocumentLinkFromAttachments } from "./attachments/getDocumentLinkFromAttachments";
import { getImageLinkFromAttachments } from "./attachments/getImageLinkFromAttachments";
import { googleDatetimeToTimestamp } from "./datetime/googleDatetimeToTimestamp";
import { eventUuid } from "./uuids/eventUuid";
import { recurringEventUuid } from "./uuids/recurringEventUuid";
import { TranslatedContents } from "@/src/clients/translation-api/translation.types";

export const buildIndexableEvent = (
  rawEvent: PostEventRequestBody,
  geolocation: GeoLocation,
  community: GeoLocation,
  contentWithMetadata: EventContentWithMetadata | null,
  scope: RuralEventScope,
  classification: RuralEventClassification | null,
  translatedContents: TranslatedContents | null
): IndexedEvent => {
  const log = getLogger("buildIndexableEvent");

  const indexableEvent: IndexedEvent = {
    id: eventUuid(rawEvent),

    /**
     * contents
     */
    // find item with language==de
    "summary.de":
      translatedContents?.translations
        .find((translation) => translation.language === "de")
        ?.title?.trim() ||
      rawEvent.summary ||
      "",
    "summary.en":
      translatedContents?.translations
        .find((translation) => translation.language === "en")
        ?.title?.trim() ||
      rawEvent.summary ||
      "",
    "summary.pl":
      translatedContents?.translations
        .find((translation) => translation.language === "pl")
        ?.title?.trim() ||
      rawEvent.summary ||
      "",
    "summary.uk":
      translatedContents?.translations
        .find((translation) => translation.language === "uk")
        ?.title?.trim() ||
      rawEvent.summary ||
      "",
    "summary.ru":
      translatedContents?.translations
        .find((translation) => translation.language === "ru")
        ?.title?.trim() ||
      rawEvent.summary ||
      "",
    "description.de":
      translatedContents?.translations
        .find((translation) => translation.language === "de")
        ?.text?.trim() ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.en":
      translatedContents?.translations
        .find((translation) => translation.language === "en")
        ?.text?.trim() ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.pl":
      translatedContents?.translations
        .find((translation) => translation.language === "pl")
        ?.text?.trim() ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",
    "description.uk":
      translatedContents?.translations
        .find((translation) => translation.language === "uk")
        ?.text?.trim() ||
      contentWithMetadata?.description ||
      rawEvent.description ||
      "",

    "description.ru":
      translatedContents?.translations
        .find((translation) => translation.language === "ru")
        ?.text?.trim() ||
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
      community.geo?.point.lat || geolocation.geo?.point.lat || 0,
      community.geo?.point.lng || geolocation.geo?.point.lng || 0,
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

  // log warnings

  if (indexableEvent.categories.includes("unknown")) {
    log.warn(
      { event: { summary: rawEvent.summary }, classification: classification },
      "Event has no category."
    );
  }

  return indexableEvent;
};
