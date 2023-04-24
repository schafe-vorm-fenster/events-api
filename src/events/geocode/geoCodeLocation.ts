import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { GeoLocation } from "./types/GeoLocation";
import axios from "axios";
import { getLogger } from "../../../logging/log-util";
// const axios = setupCache(Axios);

/**
 * geocode location using the svf geoapi
 * @param location: string
 * @returns GeoLocation
 */
export const geoCodeLocation = async (
  location: string
): Promise<GeoLocation> => {
  const log = getLogger("api.events.geocode");
  log.debug("geocoding location: ", location);
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
        throw new Error("got no json response");
      }
    })
    .catch((error) => {
      log.error("error while geocoding location: ", error);
      throw error;
    });
};
