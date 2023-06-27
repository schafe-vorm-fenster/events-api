import { isISO8601 } from "../../helpers/datetime/isISO8601";

/**
 * Returns a date filter.
 * @param isoDate
 */
export const getAfterFilter = (isoDate?: string): string | undefined => {
  if (!isoDate) return undefined;

  if (!isISO8601(isoDate)) {
    throw new Error(
      "invalid after param, after has to be a valid iso8601 string"
    );
  }
  const afterTimestamp: number | undefined = isoDate
    ? new Date(isoDate).getTime()
    : undefined;

  const afterFilter: string | undefined = afterTimestamp
    ? `start:>= ${afterTimestamp} || end:>= ${afterTimestamp}`
    : undefined;

  return afterFilter;
};
