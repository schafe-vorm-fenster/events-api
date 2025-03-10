import { ISO8601, ISO8601Schema } from "../../../../rest/iso8601.types";

/**
 * Returns a date filter.
 * @param isoDate
 */
export const getAfterFilter = (isoDate?: ISO8601): string | undefined => {
  if (!isoDate) return undefined;

  ISO8601Schema.parse(isoDate);
  const afterTimestamp: number = new Date(isoDate).getTime();
  const afterFilter: string = `start:>= ${afterTimestamp} || end:>= ${afterTimestamp}`;
  return afterFilter;
};
