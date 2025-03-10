import { GeonameId } from "@/src/events/types/geonames.types";

/**
 * Extract the id from a geoname id string.
 * @param geonameId: string in the format "geoname.2838887"
 * @returns number
 */
export const extractGeonameId = (geonameId: GeonameId): number => {
  return parseInt(geonameId.split(".")[1]);
};
