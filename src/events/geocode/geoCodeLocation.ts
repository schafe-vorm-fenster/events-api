import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { GeoLocation } from "./types/GeoLocation";
const axios = setupCache(Axios);

/**
 * geocode location using the svf geoapi
 * @param location: string
 * @returns GeoLocation
 */
export const geoCodeLocation = async (
  location: string
): Promise<GeoLocation> => {
  return await axios
    .get(`${process.env.SVF_GEOAPI_URL}findbyaddress`, {
      params: {
        location: location,
      },
      headers: {
        "Sheep-Token": process.env.SVF_GEOAPI_TOKEN,
        Accept: "application/json",
      },
    })
    .then((response) => {
      if (response.data?.json) return response.data.json as GeoLocation;
      throw new Error("got no json response");
    })
    .catch((error) => {
      throw error;
    });
};
