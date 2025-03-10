import {
  HealthyServiceInfoSchema,
  ServiceStatusSchema,
  UnhealthyServiceInfoSchema,
} from "@/src/rest/health.schema";
import { getGeoApiConfig } from "./helpers/config";

/**
 * Checks the health of the geo-api service.
 * @returns Promise<ServiceStatusSchema>
 */
export const checkGeoApiHealth = async (): Promise<ServiceStatusSchema> => {
  try {
    const config = getGeoApiConfig();
    const url = new URL("/api/health", config.host);

    const response = await fetch(url, {
      headers: {
        "Sheep-Token": config.token,
        Accept: "application/json",
      },
    });
    const body: string = await response.text();

    if (!response.ok || !body.includes("geo-api")) {
      throw new Error(`geo-api is not healthy`);
    }

    const serviceInfo: HealthyServiceInfoSchema = {
      status: response.status | 200,
      message: "geo-api is healthy",
      name: "geo-api",
      version: "1.0.0", // TODO: get version from response
    };
    return serviceInfo;
  } catch (error) {
    console.error(error);

    const serviceInfo: UnhealthyServiceInfoSchema = {
      status: 503,
      error: (error instanceof Error
        ? error.message
        : "Unknown error") as string,
      name: "geo-api",
      version: "unknown",
    };
    return serviceInfo;
  }
};
