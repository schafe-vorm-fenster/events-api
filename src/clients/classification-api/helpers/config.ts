import { clientLogger } from "@/logging/loggerApps.config";
import { getApiConfig, getApiHost, getApiToken } from "../../helpers/config";

// Environment variable names for classification API
const CLASSIFICATION_API_HOST_ENV = "SVF_CLASSIFICATIONAPI_HOST";
const CLASSIFICATION_API_TOKEN_ENV = "SVF_CLASSIFICATIONAPI_TOKEN";

/**
 * Returns the validated classification API host URL from environment variables
 * @returns The API host URL or throws an error if not configured
 */
export const getClassificationApiHost = (): string => {
  return getApiHost(
    CLASSIFICATION_API_HOST_ENV,
    clientLogger.classification.config
  );
};

/**
 * Returns the validated classification API token from environment variables
 * @returns The API token or throws an error if not configured
 */
export const getClassificationApiToken = (): string => {
  return getApiToken(
    CLASSIFICATION_API_TOKEN_ENV,
    clientLogger.classification.config
  );
};

/**
 * Safe wrapper to get classification API configuration
 * Returns the host and token or null values if either is missing
 * @returns Object containing host and token, or null values if configuration is invalid
 */
export const getClassificationApiConfig = () => {
  return getApiConfig(
    CLASSIFICATION_API_HOST_ENV,
    CLASSIFICATION_API_TOKEN_ENV,
    clientLogger.classification.config
  );
};
