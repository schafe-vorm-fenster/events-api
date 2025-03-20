import {
  HealthyServiceInfoSchema,
  ServiceStatusSchema,
  UnhealthyServiceInfoSchema,
} from "@/src/rest/health.schema";
import { getConfigCacheTTL } from "@/src/config/cache-control-header";
import { getCalendarApiConfig } from "./helpers/config";

/**
 * Checks the health of the calendar API service.
 * @returns Promise<ServiceStatusSchema>
 */
export const checkCalendarApiHealth =
  async (): Promise<ServiceStatusSchema> => {
    try {
      const { host, token } = getCalendarApiConfig();
      const url: URL = new URL("/api/health", host);
      const response = await fetch(url, {
        headers: {
          "Sheep-Token": token,
          Accept: "application/json",
        },
        cache: "force-cache",
        next: {
          revalidate: getConfigCacheTTL(),
        },
      });
      const healthReport: HealthyServiceInfoSchema =
        (await response.json()) as HealthyServiceInfoSchema;

      if (!response.ok || healthReport.status !== 200) {
        throw new Error(`calendar-api is not healthy`);
      }

      const serviceInfo: HealthyServiceInfoSchema = {
        status: response.status || 200,
        message: "healthy",
        name: healthReport.name,
        version: healthReport.version,
      };
      return serviceInfo;
    } catch (error) {
      console.error(error);

      const serviceInfo: UnhealthyServiceInfoSchema = {
        status: 503,
        error: (error instanceof Error
          ? error.message
          : "Unknown error") as string,
        name: "calendar-api",
        version: "unknown",
      };
      return serviceInfo;
    }
  };
