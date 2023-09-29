import { GeoLocation } from "./types/GeoLocation";
import axios from "axios";
import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";

type GetGeoLocationResponse = GeoLocation | null;

/**
 * geocode location using the svf geoapi
 * @param geonameId: number
 * @returns GeoLocation
 */
export const getGeoLocation = async (
  geonameId: number
): Promise<GetGeoLocationResponse> => {
  const log = getLogger(client.geocode.getcommunity);
  log.debug({ geonameId }, "get geo location");
  return await axios
    .get(`${process.env.SVF_GEOAPI_URL}api/community/${geonameId}`, {
      headers: {
        "Sheep-Token": process.env.SVF_GEOAPI_TOKEN,
        Accept: "application/json",
      },
    })
    .then((response) => {
      if (response.data) {
        return response.data as GeoLocation;
      } else {
        log.warn("got no json response");
        return null;
      }
    })
    .catch((error) => {
      log.error("error while getting geo location: ", error);
      return null;
    });
};
