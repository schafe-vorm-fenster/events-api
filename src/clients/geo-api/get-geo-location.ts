import { GeoLocation } from "./types/geo-location.types";
import { getLogger } from "../../../logging/logger";
import { clientLogger } from "../../../logging/loggerApps.config";
import { getGeoApiConfig } from "./helpers/config";

type GetGeoLocationResponse = GeoLocation | null;

/**
 * geocode location using the svf geoapi
 * @param geonameId: number
 * @returns GeoLocation
 */
export const getGeoLocation = async (
  geonameId: number
): Promise<GetGeoLocationResponse> => {
  const log = getLogger(clientLogger.geo.getcommunity);
  log.debug({ geonameId }, "get geo location");
  try {
    const config = getGeoApiConfig();
    const url = new URL(`/api/community/${geonameId}`, config.host);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Sheep-Token": config.token,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data) {
      return data as GeoLocation;
    } else {
      log.warn("got no json response");
      return null;
    }
  } catch (error) {
    log.error("error while getting geo location: ", error);
    return null;
  }
};
