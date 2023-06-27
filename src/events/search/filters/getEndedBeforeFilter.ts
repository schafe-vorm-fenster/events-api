import { isISO8601 } from "../../helpers/datetime/isISO8601";

/**
 * Returns a date filter.
 * @param isoDate | now
 */
export const getEndedBeforeFilter = (isoDate?: string): string | undefined => {
  if (!isoDate) return undefined;

  if (!isISO8601(isoDate) && isoDate.toLowerCase() !== "now") {
    throw new Error(
      "invalid before param, before has to be a valid iso8601 string or the constant 'now'"
    );
  }

  let beforeTimestamp: number | undefined = undefined;
  if (isoDate.toLowerCase() === "now") {
    beforeTimestamp = new Date().getTime();
  } else {
    beforeTimestamp = isoDate ? new Date(isoDate).getTime() : undefined;
  }

  const beforeFilter: string | undefined = beforeTimestamp
    ? `start:<=${beforeTimestamp} && end:<=${beforeTimestamp}`
    : undefined;

  return beforeFilter;
};
