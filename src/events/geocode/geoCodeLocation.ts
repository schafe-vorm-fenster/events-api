import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";
import { checkIfJsonObject } from "../helpers/checkIfJsonObject";
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
      checkIfJsonObject(response.data);
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
