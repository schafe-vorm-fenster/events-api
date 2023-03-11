import { PostEventRequestBody } from "../events.types";

/**
 * get unique id string for event
 * @param event
 * @returns string
 */
export const getUniqueIdStringForEvent = (
  event: PostEventRequestBody
): string => {
  const eventId: string | null = event.id || event.etag || null;
  const calendarId: string | null =
    event.organizer?.id ||
    event.organizer?.email ||
    event.creator?.id ||
    event.creator?.email ||
    event.iCalUID ||
    null;

  if (!calendarId && !eventId)
    throw new Error("could not generate a uuid for this event");

  return ((calendarId as string) + eventId) as string;
};
