import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { GeoLocation } from "./types/GeoLocation";
import axios from "axios";
import { getLogger } from "../../../logging/logger";
import { client } from "../../../logging/loggerApps.config";
// TODO: const axios = setupCache(Axios);

type GeoCodeLocationResponse = GeoLocation | null;

/**
 * geocode location using the svf geoapi
 * @param location: string
 * @returns GeoLocation
 */
export const geoCodeLocation = async (
  location: string
): Promise<GeoCodeLocationResponse> => {
  const log = getLogger(client.geocode.findbyaddress);
  log.debug({ location: location }, "geocoding location");
  return await axios
    .get(`${process.env.SVF_GEOAPI_URL}api/findbyaddress/`, {
      params: {
        location: location,
      },
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
      log.error("error while geocoding location: ", error);
      return null;
    });
};
