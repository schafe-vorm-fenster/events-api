import {
  HealthyServiceInfoSchema,
  ServiceStatusSchema,
  UnhealthyServiceInfoSchema,
} from "@/src/rest/health.schema";
import { getClassificationApiConfig } from "./helpers/config";

/**
 * Checks the health of the classification API service.
 * @returns Promise<ServiceStatusSchema>
 */
export const checkClassificationApiHealth =
  async (): Promise<ServiceStatusSchema> => {
    try {
      const { host, token } = getClassificationApiConfig();
      const url: string = host;
      const response = await fetch(url, {
        headers: {
          "Sheep-Token": token,
          Accept: "application/json",
        },
      });
      const body: string = await response.text();

      // get name from json until we have a health endpoint
      const nameRegex = /"title"\s*:\s*"([^"]+)"/;
      const name = body.match(nameRegex)?.[1];

      // get version from json until we have a health endpoint
      const versionRegex = /"version"\s*:\s*"(\d+\.\d+\.\d+)"/;
      const version = body.match(versionRegex)?.[1];

      if (!response.ok || !body.includes("classification-api")) {
        throw new Error(`classification-api is not healthy`);
      }

      const serviceInfo: HealthyServiceInfoSchema = {
        status: response.status || 200,
        message: "is healthy",
        name: name || "classification-api",
        version: version, // TODO: get version from health endpoint
      };
      return serviceInfo;
    } catch (error) {
      console.error(error);

      const serviceInfo: UnhealthyServiceInfoSchema = {
        status: 503,
        error: (error instanceof Error
          ? error.message
          : "Unknown error") as string,
        name: "classification-api",
        version: "unknown",
      };
      return serviceInfo;
    }
  };
