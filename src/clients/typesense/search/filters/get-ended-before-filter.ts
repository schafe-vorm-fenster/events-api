import { ISO8601Schema } from "../../../../rest/iso8601.types";

/**
 * Returns a date filter for events that ended before the specified date.
 * Accepts either an ISO8601 date string or 'now'.
 * @param isoDate ISO8601 date string or 'now'
 */
export const getEndedBeforeFilter = (isoDate?: string): string | undefined => {
  if (!isoDate) return undefined;

  let beforeTimestamp: number;
  if (isoDate.toLowerCase() === "now") {
    beforeTimestamp = new Date().getTime();
  } else {
    ISO8601Schema.parse(isoDate);
    beforeTimestamp = new Date(isoDate).getTime();
  }

  return `start:<=${beforeTimestamp} && end:<=${beforeTimestamp}`;
};
