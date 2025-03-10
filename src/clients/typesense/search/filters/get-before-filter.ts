import { ISO8601, ISO8601Schema } from "../../../../rest/iso8601.types";

/**
 * Returns a date filter.
 * @param isoDate
 */
export const getBeforeFilter = (isoDate?: ISO8601): string | undefined => {
  if (!isoDate) return undefined;
  ISO8601Schema.parse(isoDate);
  const beforeTimestamp: number = new Date(isoDate).getTime();
  const beforeFilter: string = `start:<= ${beforeTimestamp}`;
  return beforeFilter;
};
