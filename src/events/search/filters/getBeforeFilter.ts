import { isISO8601 } from "../../helpers/datetime/isISO8601";

/**
 * Returns a date filter.
 * @param isoDate
 */
export const getBeforeFilter = (isoDate?: string): string | undefined => {
  if (!isoDate) return undefined;

  if (!isISO8601(isoDate)) {
    throw new Error(
      "invalid before param, before has to be a valid iso8601 string"
    );
  }
  const beforeTimestamp: number | undefined = isoDate
    ? new Date(isoDate).getTime()
    : undefined;

  const beforeFilter: string | undefined = beforeTimestamp
    ? `start:<= ${beforeTimestamp}`
    : undefined;

  return beforeFilter;
};
