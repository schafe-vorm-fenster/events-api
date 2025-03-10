import { clientLogger } from "@/logging/loggerApps.config";
import { getApiConfig, getApiHost, getApiToken } from "../../helpers/config";

// Environment variable names for geo API
const GEO_API_HOST_ENV = "SVF_GEOAPI_URL";
const GEO_API_TOKEN_ENV = "SVF_GEOAPI_TOKEN";

/**
 * Returns the validated geo API host URL from environment variables
 * @returns The API host URL or throws an error if not configured
 */
export const getGeoApiHost = (): string => {
  return getApiHost(GEO_API_HOST_ENV, clientLogger.geo.config);
};

/**
 * Returns the validated geo API token from environment variables
 * @returns The API token or throws an error if not configured
 */
export const getGeoApiToken = (): string => {
  return getApiToken(GEO_API_TOKEN_ENV, clientLogger.geo.config);
};

/**
 * Safe wrapper to get geo API configuration
 * Returns the host and token or null values if either is missing
 * @returns Object containing host and token, or null values if configuration is invalid
 */
export const getGeoApiConfig = () => {
  return getApiConfig(
    GEO_API_HOST_ENV,
    GEO_API_TOKEN_ENV,
    clientLogger.geo.config
  );
};
